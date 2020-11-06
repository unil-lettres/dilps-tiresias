import {Component, Inject, Injector, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
    NaturalAbstractList,
    NaturalQueryVariablesManager,
    NaturalSearchSelections,
    PaginationInput,
    Sorting,
    toUrl,
} from '@ecodev/natural';
import {clone, defaults, isArray, isNumber, isObject, isString, merge, pick, pickBy} from 'lodash-es';
import {forkJoin, Observable} from 'rxjs';
import {SITE} from '../app.config';
import {CardService} from '../card/services/card.service';
import {CollectionService} from '../collections/services/collection.service';
import {FakeCollection} from '../collections/services/fake-collection.resolver';
import {NumberSelectorComponent} from '../quizz/shared/number-selector/number-selector.component';
import {
    CollectionSelectorComponent,
    CollectionSelectorData,
    CollectionSelectorResult,
} from '../shared/components/collection-selector/collection-selector.component';
import {DownloadComponent, DownloadComponentData} from '../shared/components/download/download.component';
import {MassEditComponent} from '../shared/components/mass-edit/mass-edit.component';
import {
    CardFilter,
    Cards,
    Cards_cards_items,
    CardSortingField,
    CardsVariables,
    Site,
    SortingOrder,
    UserRole,
    Viewer,
} from '../shared/generated-types';
import {adminConfig, NaturalSearchFacetsService} from '../shared/natural-search-facets.service';
import {shuffleArray} from '../shared/services/utility';
import {StatisticService} from '../statistics/services/statistic.service';
import {UserService} from '../users/services/user.service';
import {ViewGridComponent} from '../view-grid/view-grid.component';
import {ViewListComponent} from '../view-list/view-list.component';
import {Location, ViewMapComponent} from '../view-map/view-map.component';

export interface ViewInterface {
    selectAll: () => Cards_cards_items[];
    unselectAll: () => void;
}

enum ViewMode {
    grid = 'grid',
    list = 'list',
    map = 'map',
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent extends NaturalAbstractList<Cards['cards'], CardsVariables> implements OnInit {
    /**
     * Reference to grid component
     */
    @ViewChild(ViewGridComponent) public gridComponent: ViewGridComponent;

    /**
     * Reference to list component
     */
    @ViewChild(ViewListComponent) public listComponent: ViewListComponent;

    /**
     * Reference to map component
     */
    @ViewChild(ViewMapComponent) public mapComponent: ViewMapComponent;

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
    public selected: Cards_cards_items[] = [];

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
    public user: Viewer['viewer'];

    /**
     * True if button for archive download has permissions to be displayed
     */
    public showDownloadCollection = true;

    /**
     * Number of items added to dom from the gallery (grid view)
     */
    public gridNumberVisibleItems: number;

    /**
     * Total number of items matching with search
     */
    public gridNumberTotalItems: number;

    /**
     * Enum that specified the displayed list
     */
    public viewMode: ViewMode = ViewMode.grid;

    public Site = Site;

    /**
     * Sorting applied when none is asked
     */
    protected defaultSorting: Array<Sorting> = [
        {
            field: CardSortingField.creationDate,
            order: SortingOrder.DESC,
        },
    ];

    /**
     * Pagination by default when none is asked
     */
    protected defaultPagination: Required<PaginationInput> = {
        pageSize: 15,
        pageIndex: 0,
        offset: null,
    };

    constructor(
        private cardService: CardService,
        private collectionService: CollectionService,
        private userService: UserService,
        private dialog: MatDialog,
        injector: Injector,
        private statisticService: StatisticService,
        public facetService: NaturalSearchFacetsService,
        @Inject(SITE) public site: Site,
    ) {
        super(cardService, injector);

        this.naturalSearchFacets = facetService.getFacets();
    }

    public ngOnInit(): void {
        super.ngOnInit();

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
                return adminConfig.some(config => {
                    return config.field === value.field;
                });
            });
        });

        if (containAdminSelection) {
            this.pushAdminConfig();
        }

        // Listen to route data and resolved data
        // Required because when /:id change, the route stays the same, and component is not re-initialized
        this.route.data.subscribe(data => {
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
                filter.groups[filter.groups.length - 1].conditions[0].creator = {equal: {value: data.creator.id}};
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
     * On pagination request, dont persist for gallery as it's meaningless
     */
    public pagination(event: Required<PaginationInput>, defer?: Promise<unknown>): void {
        if (this.viewMode === ViewMode.grid) {
            this.persistSearch = false;
            super.pagination(event, defer);
            this.persistSearch = true;
        } else {
            super.pagination(event, defer);
        }
    }

    public gridContentChange(event): void {
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
        const roles = this.route.snapshot.data.showDownloadCollectionForRoles;
        const roleIsAllowed = this.user && this.user.role && (!roles || (roles && roles.indexOf(this.user.role) > -1));
        const hasCollection = this.collection && this.collection.id;
        this.showDownloadCollection = hasCollection && roleIsAllowed;
    }

    public select(cards: Cards_cards_items[]): void {
        this.selected = cards;
    }

    public reset(): void {
        this.selected = [];
        this.pagination(this.defaultPagination as Required<PaginationInput>); // reset pagination, will clean url
    }

    public linkSelectionToCollection(selection: Cards_cards_items[]): void {
        this.linkToCollection({images: selection});
    }

    public linkCollectionToCollection(collection: FakeCollection): void {
        this.linkToCollection({collection});
    }

    public downloadSelection(selection: Cards_cards_items[]): void {
        this.download({images: selection});
    }

    public downloadCollection(collection): void {
        this.download({collection});
    }

    public unlinkFromCollection(selection: Cards_cards_items[]): void {
        if (!this.collection) {
            return;
        }

        this.collectionService.unlink(this.collection, selection).subscribe(() => {
            this.alertService.info('Les images ont été retirées');
            this.reset();
        });
    }

    public delete(selection: Cards_cards_items[]): void {
        this.alertService
            .confirm(
                'Suppression',
                'Voulez-vous supprimer définitivement cet/ces élément(s) ?',
                'Supprimer définitivement',
            )
            .subscribe(confirmed => {
                if (confirmed) {
                    this.cardService.delete(selection).subscribe(() => {
                        this.alertService.info('Supprimé');
                        this.reset();
                    });
                }
            });
    }

    public goToQuizz(selected: Cards_cards_items[] | null = null): void {
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
                        this.cardService.getAll(quizzVars).subscribe(cards => {
                            this.router.navigateByUrl('quizz;cards=' + cards.items.map(e => e.id).join(','));
                        });
                    }
                });
        }
    }

    public edit(selected: Cards_cards_items[]): void {
        const selection = selected.filter(card => card.permissions.update);

        this.dialog
            .open(MassEditComponent, {
                width: '440px',
            })
            .afterClosed()
            .subscribe(model => {
                if (!model) {
                    return;
                }

                /**
                 * Pick attributes with values that are objects, numbers, non-empty array, non-empty strings
                 */
                const changeAttributes = pickBy(model, (value, key) => {
                    return (
                        isObject(value) ||
                        isNumber(value) ||
                        (isString(value) && value !== '') ||
                        (isArray(value) && value.length > 0)
                    );
                });

                const observables = [];
                for (const s of selection) {
                    const changes = clone(changeAttributes);
                    defaults(changes, s);

                    if (changes.artists) {
                        changes.artists = changes.artists.map(a => (a.name ? a.name : a));
                    }

                    if (changes.institution) {
                        changes.institution = changes.institution.name ? changes.institution.name : changes.institution;
                    }

                    observables.push(this.cardService.updateNow(changes));
                }

                forkJoin(observables).subscribe(() => {
                    this.alertService.info('Mis à jour');
                    this.reset();
                });
            });
    }

    public selectAll(): void {
        this.selected = this.getViewComponent().selectAll();
    }

    public unselectAll(): void {
        this.selected = [];
        this.getViewComponent().unselectAll();
    }

    protected getDataObservable(): Observable<Cards['cards']> {
        return this.service.watchAll(this.variablesManager, this.ngUnsubscribe, 'network-only');
    }

    /**
     * Return the only activated View Component
     */
    private getViewComponent(): ViewInterface {
        return this.gridComponent || this.listComponent;
    }

    private linkToCollection(data: CollectionSelectorData): void {
        this.dialog.open<CollectionSelectorComponent, CollectionSelectorData, CollectionSelectorResult>(
            CollectionSelectorComponent,
            {
                width: '400px',
                position: {
                    top: '74px',
                    right: '10px',
                },
                data: data,
            },
        );
    }

    private download(selection: Partial<DownloadComponentData>): void {
        const data = merge({denyLegendsDownload: !this.user}, selection);

        this.dialog.open(DownloadComponent, {
            width: '600px',
            data,
        });
    }

    /**
     * Push admin config, but only if it does not already exist
     */
    private pushAdminConfig(): void {
        if (!this.naturalSearchFacets.some(conf => conf === adminConfig[0])) {
            this.naturalSearchFacets = this.naturalSearchFacets.concat(adminConfig);
        }
    }

    public search(naturalSearchSelections: NaturalSearchSelections): void {
        super.search(naturalSearchSelections);
        this.statisticService.recordSearch();
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
}
