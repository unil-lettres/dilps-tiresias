import {AfterViewInit, Component, computed, inject, OnInit, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {PageEvent} from '@angular/material/paginator';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
    NaturalAbstractList,
    NaturalIconDirective,
    NaturalQueryVariablesManager,
    NaturalSearchComponent,
    NaturalSearchSelections,
    onHistoryEvent,
    PaginationInput,
    Sorting,
    WithId,
} from '@ecodev/natural';
import {clone, defaults, isArray, isNumber, isObject, isString, merge, pick, pickBy} from 'lodash-es';
import {NgScrollbar} from 'ngx-scrollbar';
import {concatMap, finalize, from, Observable, of} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {ReusableRouteStatus, RouteReuseStatus} from '../app-route-reuse-strategy';
import {SITE} from '../app.config';
import {CardService} from '../card/services/card.service';
import {ChangeService} from '../changes/services/change.service';
import {CollectionService} from '../collections/services/collection.service';
import {FakeCollection} from '../collections/services/fake-collection.resolver';
import {DomainService} from '../domains/services/domain.service';
import {NumberSelectorComponent} from '../quizz/shared/number-selector/number-selector.component';
import {
    CollectionSelectorComponent,
    CollectionSelectorData,
    CollectionSelectorResult,
} from '../shared/components/collection-selector/collection-selector.component';
import {ExportMenuComponent} from '../shared/components/export-menu/export-menu.component';
import {LogoComponent} from '../shared/components/logo/logo.component';
import {MassEditComponent} from '../shared/components/mass-edit/mass-edit.component';
import {ThesaurusModel} from '../shared/components/thesaurus/thesaurus.component';
import {HideTooltipDirective} from '../shared/directives/hide-tooltip.directive';
import {
    CardFilter,
    CardInput,
    Cards,
    CardSortingField,
    CardVisibility,
    CreateCard,
    Site,
    SortingOrder,
    UserRole,
    Viewer,
} from '../shared/generated-types';
import {adminFacets, dilps, tiresias} from '../shared/natural-search-facets';
import {shuffleArray} from '../shared/services/utility';
import {StatisticService} from '../statistics/services/statistic.service';
import {UserService} from '../users/services/user.service';
import {ContentChange, ViewGridComponent} from '../view-grid/view-grid.component';
import {ViewListComponent} from '../view-list/view-list.component';
import {Location, ViewMapComponent} from '../view-map/view-map.component';

function applyChanges(
    destination: Cards['cards']['items'][0],
    changes: Partial<CardInput>,
): WithId<Partial<CardInput>> {
    const result = {
        id: destination.id,
        ...clone(changes),
    };
    defaults(result, destination);
    if (result.artists) {
        result.artists = result.artists.map((a: string | ThesaurusModel) => (typeof a === 'string' ? a : a.name));
    }

    if (result.institution) {
        result.institution =
            typeof result.institution === 'string' ? result.institution : (result.institution as ThesaurusModel).name;
    }

    return result;
}

export type ViewInterface = {
    selectAll: () => Promise<Cards['cards']['items'][0][]>;
    unselectAll: () => void;
};

type SelectableDomains = {
    id: string;
    name: string;
    selected?: boolean;
};

enum ViewMode {
    grid = 'grid',
    list = 'list',
    map = 'map',
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    imports: [
        MatMenuModule,
        MatToolbarModule,
        LogoComponent,
        MatButtonModule,
        MatTooltipModule,
        HideTooltipDirective,
        MatIconModule,
        NaturalSearchComponent,
        MatChipsModule,
        ViewGridComponent,
        ViewListComponent,
        ViewMapComponent,
        NaturalIconDirective,
        ExportMenuComponent,
        NgScrollbar,
    ],
})
export class ListComponent
    extends NaturalAbstractList<CardService>
    implements OnInit, AfterViewInit, ReusableRouteStatus
{
    private readonly collectionService = inject(CollectionService);
    private readonly userService = inject(UserService);
    private readonly dialog = inject(MatDialog);
    private readonly statisticService = inject(StatisticService);
    private readonly changeService = inject(ChangeService);
    private readonly domainService = inject(DomainService);

    public readonly site = inject(SITE);

    /**
     * Reference to natural search
     */
    private readonly naturalSearchComponent = viewChild(NaturalSearchComponent);

    private readonly hasActiveSearch = computed(() => {
        const selections = this.naturalSearchComponent()?.innerSelections();

        return !!selections && selections.reduce((acc, val) => acc.concat(val), []).length > 0;
    });

    /**
     * Reference to grid component
     */
    public readonly gridComponent = viewChild(ViewGridComponent);

    /**
     * Reference to list component
     */
    public readonly listComponent = viewChild(ViewListComponent);

    /**
     * Expose enum for template
     */
    public ViewMode = ViewMode;

    /**
     * Expose enum for template
     */
    public SortingOrder = SortingOrder;

    /**
     * Checked content for selection
     */
    public selected: Cards['cards']['items'][0][] = [];

    /**
     * Show logo on top left corner
     */
    public showLogo = true;

    /**
     * Contextual collection
     * Used to link
     * Before component initialization it is undefined, then it is either null or FakeCollection
     */
    public collection: FakeCollection | undefined | null;

    /**
     * Current user
     */
    public user!: Viewer['viewer'];

    /**
     * True if button for archive download has permissions to be displayed
     */
    public showDownloadCollection = true;

    /**
     * Number of items added to dom from the gallery (grid view)
     */
    public gridNumberVisibleItems = 0;

    /**
     * Total number of items matching with search
     */
    public gridNumberTotalItems = 0;

    /**
     * Enum that specified the displayed list
     */
    public viewMode: ViewMode = ViewMode.grid;
    public domains: SelectableDomains[] = [];

    /**
     * Specifies if labels must be always displayed or only on hover
     */
    public showLabels = false;
    public routeReuseStatus: RouteReuseStatus = RouteReuseStatus.default;

    public Site = Site;
    public UserRole = UserRole;
    public CardSortingField = CardSortingField;

    /**
     * Sorting applied when none is asked
     */
    protected override defaultSorting: Sorting[] = [
        {
            field: CardSortingField.creationDate,
            order: SortingOrder.DESC,
        },
    ];

    /**
     * Pagination by default when none is asked
     */
    protected override defaultPagination: Required<PaginationInput> = {
        pageSize: 25,
        pageIndex: 0,
        offset: null,
    };

    private readonly routeData$ = this.route.data.pipe(takeUntilDestroyed());

    private readonly service$ = this.service.watchAll(this.variablesManager, 'network-only').pipe(takeUntilDestroyed());

    public constructor() {
        super(inject(CardService));

        this.naturalSearchFacets = this.site === Site.Dilps ? dilps() : tiresias();
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.showLabels = sessionStorage.getItem('showLabels') !== 'false';

        // Init view from last selection Defaults on grid
        const viewMode = sessionStorage.getItem('view-mode');
        if (viewMode) {
            this.viewMode = viewMode as ViewMode;
        }

        // Setup admin features
        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;
            this.updateShowDownloadCollection();

            if (this.user && this.user.role === UserRole.administrator) {
                this.pushAdminConfig();
            }
        });

        const containAdminSelection = this.naturalSearchSelections.some(selection => {
            return selection.some(value => {
                return adminFacets.some(config => {
                    return config.field === value.field;
                });
            });
        });

        if (containAdminSelection) {
            this.pushAdminConfig();
        }

        // Listen to route data and resolved data
        // Required because when /:id change, the route stays the same, and component is not re-initialized
        this.routeData$.subscribe(data => {
            this.showLogo = data.showLogo;
            this.updateShowDownloadCollection();

            if (data.collection) {
                const collectionFilter: CardFilter = {
                    groups: [{conditions: [{collections: {have: {values: [data.collection.id]}}}]}],
                };
                this.variablesManager.set('collection', {filter: collectionFilter});
            }

            if (data.filter) {
                this.variablesManager.set('route-context', {filter: data.filter});
            }

            const filter: CardFilter = {groups: [{conditions: [{filename: {equal: {value: '', not: true}}}]}]};

            // Setup own page, with self created cards
            if (data.creator && !this.collection) {
                filter.groups![filter.groups!.length - 1].conditions![0].creator = {equal: {value: data.creator.id}};
            }

            this.variablesManager.set('controller-variables', {filter: filter});

            // Only reset pagination if our collection has been initialized and the new collection is not the same as ours
            if (this.collection !== undefined && this.collection?.id !== data.collection?.id) {
                this.reset();
            }

            this.collection = data.collection || null;
        });
    }

    /**
     * Search component inner selections are not initialized before this stage, that's why we need after view init.
     */
    public ngAfterViewInit(): void {
        this.fetchDomains().subscribe(() => {
            this.domainSelectionChange();
        });
    }

    protected override handleHistoryNavigation(): void {
        onHistoryEvent(this.router).pipe(
            takeUntilDestroyed(this.destroyRef),
            filter(() => {
                if (this.routeReuseStatus === RouteReuseStatus.retrieving) {
                    this.routeReuseStatus = RouteReuseStatus.default;
                    return false;
                }

                return true;
            }),
        );
    }

    public toggleLabels(): void {
        this.showLabels = !this.showLabels;
        this.gridComponent()
            ?.gallery()
            ?.gallery.then(gallery => gallery.setLabelHover(!this.showLabels));
        sessionStorage.setItem('showLabels', this.showLabels + '');
    }

    /**
     * On pagination request, dont persist for gallery as it's meaningless
     */
    public override pagination(event: PaginationInput | PageEvent, defer?: Promise<unknown>): void {
        if (this.viewMode === ViewMode.grid) {
            this.persistSearch = false;
            super.pagination(event, defer);
            this.persistSearch = true;
        } else {
            super.pagination(event, defer);
        }
    }

    public gridContentChange(event: ContentChange): void {
        if (event.visible != null) {
            this.gridNumberVisibleItems = event.visible;
        }

        if (event.total != null) {
            this.gridNumberTotalItems = event.total;
        }
    }

    /**
     * Persist list rendering in session storage.
     */
    public setViewMode(mode: ViewMode): void {
        this.viewMode = mode;

        if (mode !== ViewMode.map) {
            sessionStorage.setItem('view-mode', mode);
            this.pagination(this.defaultPagination); // reset pagination, will clean url
        }
    }

    /**
     * Show a button to download a collection, considering permissions
     */
    public updateShowDownloadCollection(): void {
        const roles: UserRole[] = this.route.snapshot.data.showDownloadCollectionForRoles;
        const roleIsAllowed = this.user?.role && (!roles || roles?.includes(this.user.role));
        const hasCollection = this.collection?.id;
        this.showDownloadCollection = !!hasCollection && !!roleIsAllowed;
    }

    public select(cards: Cards['cards']['items'][0][]): void {
        this.selected = cards;
    }

    public reset(): void {
        this.selected = [];
        this.pagination(this.defaultPagination); // reset pagination, will clean url
    }

    public linkSelectionToCollection(selection: Cards['cards']['items'][0][]): void {
        this.linkToCollection({images: selection});
    }

    public linkCollectionToCollection(collection: FakeCollection): void {
        this.linkToCollection({collection});
    }

    public unlinkFromCollection(selection: Cards['cards']['items'][0][]): void {
        if (!this.collection) {
            return;
        }

        this.collectionService.unlink(this.collection, selection).subscribe(() => {
            this.alertService.info('Les images ont été retirées');
            this.reset();
        });
    }

    public delete(selection: Cards['cards']['items'][0][]): void {
        this.alertService
            .confirm(
                'Suppression',
                'Voulez-vous supprimer définitivement cet/ces élément(s) ?',
                'Supprimer définitivement',
            )
            .subscribe(confirmed => {
                if (confirmed) {
                    this.service.delete(selection, false).subscribe(() => {
                        this.alertService.info('Supprimé');
                        this.reset();
                    });
                }
            });
    }

    public goToQuizz(selected: Cards['cards']['items'][0][] | null = null): void {
        if (selected) {
            const selectedIds = shuffleArray(selected.map(e => e.id)).join(',');
            this.router.navigateByUrl('/quizz;cards=' + selectedIds);
        } else {
            // open box, ask for number of items to display in quizz, and get randomized list pageIndex:0, pageSize:nbItems; sort: random'
            this.dialog
                .open(NumberSelectorComponent, {
                    width: '200px',
                    position: {
                        top: '74px',
                        right: '10px',
                    },
                })
                .afterClosed()
                .subscribe(num => {
                    if (num > 0) {
                        const quizzVars = new NaturalQueryVariablesManager(this.variablesManager);
                        quizzVars.set('sorting', {sorting: [{field: CardSortingField.random}]});
                        quizzVars.set('pagination', {pagination: {pageIndex: 0, pageSize: +num}});
                        this.service.getAll(quizzVars).subscribe(cards => {
                            this.router.navigateByUrl('quizz;cards=' + cards.items.map(e => e.id).join(','));
                        });
                    }
                });
        }
    }

    public edit(selected: Cards['cards']['items'][0][]): void {
        const forbidden = selected.filter(card => !card.permissions.update);
        const changeable = forbidden.filter(card => UserService.canSuggestUpdate(this.user, card));
        const unchangeable = forbidden.filter(card => !UserService.canSuggestUpdate(this.user, card));
        const selection = selected.filter(card => card.permissions.update);

        this.dialog
            .open(MassEditComponent, {
                maxWidth: '500px',
                height: '75vh',
                minHeight: '300px',
                data: {changeable, unchangeable},
            })
            .afterClosed()
            .subscribe(result => {
                if (!result) {
                    return;
                }

                const model: CardInput = result.model;
                const createSuggestions = result.createSuggestions;

                /**
                 * Pick attributes with values that are objects, numbers, non-empty array, non-empty strings
                 */
                const changeAttributes = pickBy(model, value => {
                    return (
                        (isObject(value) && !isArray(value) && !isString(value)) ||
                        isNumber(value) ||
                        (isString(value) && value !== '') ||
                        (isArray(value) && value.length > 0)
                    );
                });

                const observables: Observable<unknown>[] = [];
                for (const s of selection) {
                    const changes = applyChanges(s, changeAttributes);
                    observables.push(this.service.updateNow(changes, false));
                }

                const suggestionsObservables: Observable<CreateCard['createCard']>[] = [];
                if (createSuggestions) {
                    changeable.forEach(changeableCard => {
                        const destination = applyChanges(changeableCard, changeAttributes);
                        const fetchedSuggestion = merge({}, destination, {
                            original: changeableCard.id,
                            visibility: CardVisibility.Private,
                        });
                        suggestionsObservables.push(this.service.create(fetchedSuggestion as CardInput));
                    });
                }

                // Last api call
                const finish = (): void => {
                    from(observables)
                        .pipe(concatMap(observable => observable))
                        .subscribe({
                            complete: () => {
                                this.alertService.info('Mis à jour');
                                this.reset();
                            },
                        });
                };

                if (suggestionsObservables.length) {
                    from(suggestionsObservables)
                        .pipe(
                            concatMap(observable => observable),
                            finalize(() => finish()),
                        )
                        .subscribe(card => observables.push(this.changeService.suggestUpdate(card)));
                } else {
                    finish();
                }
            });
    }

    public selectAll(): void {
        this.getViewComponent()
            .selectAll()
            .then(number => (this.selected = number));
    }

    public unselectAll(): void {
        this.selected = [];
        this.getViewComponent().unselectAll();
    }

    public override search(naturalSearchSelections: NaturalSearchSelections): void {
        super.search(naturalSearchSelections);
        this.statisticService.recordSearch();
    }

    public fetchDomains(): Observable<SelectableDomains[]> {
        const variables = this.variablesManager.variables.value; // card variables
        if (this.site === Site.Dilps && this.hasActiveSearch()) {
            return this.domainService.getForCards({filter: variables?.filter || {}}).pipe(
                tap(result => {
                    this.domains = result.map(d => ({...d}));
                }),
            );
        } else {
            this.domains = [];
            this.variablesManager.set('domains', null);
            return of(this.domains);
        }
    }

    public domainSelectionChange(): void {
        this.variablesManager.merge('pagination', {
            pagination: pick(this.defaultPagination, ['offset', 'pageIndex']),
        });

        const domains = this.domains.filter(d => d.selected).map(d => d.id);
        if (domains.length) {
            this.variablesManager.set('domains', {
                filter: {groups: [{conditions: [{domains: {have: {values: domains}}}]}]},
            });
        } else {
            this.variablesManager.set('domains', null);
        }
    }

    public searchByLocation($event: Location): void {
        this.viewMode = ViewMode.grid;
        this.naturalSearchSelections = [
            [
                {
                    field: 'custom',
                    name: 'location',
                    condition: {
                        distance: {
                            longitude: $event.longitude,
                            latitude: $event.latitude,
                            distance: 200, // default to 200 meters
                        },
                    },
                },
            ],
        ];
        this.search(this.naturalSearchSelections);
    }

    public canMassEdit(): boolean {
        return (
            !!this.user?.role &&
            [UserRole.administrator, UserRole.junior, UserRole.senior, UserRole.major].includes(this.user.role)
        );
    }

    /**
     * Override to never use cache
     */
    protected override getDataObservable(): Observable<Cards['cards']> {
        return this.service$;
    }

    /**
     * Return the only activated View Component
     */
    private getViewComponent(): ViewInterface {
        return (this.gridComponent() || this.listComponent())!;
    }

    private linkToCollection(data: CollectionSelectorData): void {
        this.dialog.open<CollectionSelectorComponent, CollectionSelectorData, CollectionSelectorResult>(
            CollectionSelectorComponent,
            {
                width: '400px',
                position: {
                    top: '64px',
                    left: '160px',
                },
                data: data,
            },
        );
    }

    /**
     * Push admin config, but only if it does not already exist
     */
    private pushAdminConfig(): void {
        if (!this.naturalSearchFacets.includes(adminFacets[0])) {
            const index = this.naturalSearchFacets.length - (this.site === Site.Dilps ? 1 : 0);
            this.naturalSearchFacets.splice(index, 0, ...adminFacets);
        }
    }
}
