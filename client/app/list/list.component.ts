import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { NaturalAbstractList, NaturalPageEvent, NaturalQueryVariablesManager, Sorting } from '@ecodev/natural';
import { clone, defaults, isArray, isString, merge, pickBy } from 'lodash';
import { forkJoin } from 'rxjs';
import { CardService } from '../card/services/card.service';
import { CollectionService } from '../collections/services/collection.service';
import { NumberSelectorComponent } from '../quizz/shared/number-selector/number-selector.component';
import { CollectionSelectorComponent } from '../shared/components/collection-selector/collection-selector.component';
import { DownloadComponent } from '../shared/components/download/download.component';
import { MassEditComponent } from '../shared/components/mass-edit/mass-edit.component';
import {
    CardFilter,
    CardSortingField,
    Cards,
    CardsVariables,
    SortingOrder,
    UserRole,
    Viewer,
} from '../shared/generated-types';

import { adminConfig, cardsConfiguration } from '../shared/natural-search-configurations';
import { UtilityService } from '../shared/services/utility.service';
import { UserService } from '../users/services/user.service';
import { ViewGridComponent } from '../view-grid/view-grid.component';
import { ViewListComponent } from '../view-list/view-list.component';
import { ViewMapComponent } from '../view-map/view-map.component';

export interface ViewInterface {
    selectAll: () => any[];
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
    @ViewChild(ViewGridComponent, {static: false}) gridComponent: ViewGridComponent;

    /**
     * Reference to list component
     */
    @ViewChild(ViewListComponent, {static: false}) listComponent: ViewListComponent;

    /**
     * Reference to map component
     */
    @ViewChild(ViewMapComponent, {static: false}) mapComponent: ViewMapComponent;

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
    public selected;

    /**
     * Show logo on top left corner
     */
    public showLogo = true;

    /**
     * Contextual collection
     * Used to link
     */
    public collection;

    /**
     * Current user
     */
    public user: Viewer['viewer'];

    /**
     * True if button for archive download has permissions to be displayed
     */
    public showDownloadCollection = true;

    protected defaultSorting: Array<Sorting> = [
        {
            field: CardSortingField.creationDate,
            order: SortingOrder.DESC,
        },
        {
            field: CardSortingField.id,
            order: SortingOrder.ASC,
        },
    ];

    /**
     * Enum that specified the displayed list
     */
    public viewMode: ViewMode = ViewMode.grid;

    constructor(private cardService: CardService,
                private collectionService: CollectionService,
                private userService: UserService,
                private dialog: MatDialog,
                injector: Injector) {

        super(cardService, injector);

        this.naturalSearchFacets = cardsConfiguration;
    }

    ngOnInit() {

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

            if (this.user.role === UserRole.administrator) {
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
                const filter: CardFilter = {groups: [{conditions: [{collections: {have: {values: [data.collection.id]}}}]}]};
                this.variablesManager.set('collection', {filter: filter});
            }

            if (data.filter) {
                this.variablesManager.set('route-context', {filter: data.filter});
            }

            const filters: CardFilter = {
                groups: [{conditions: [{filename: {equal: {value: '', not: true}}}]}],
            };

            // Setup own page, with self created cards
            if (data.creator && !this.collection) {
                filters.groups[filters.groups.length - 1].conditions[0].creator = {equal: {value: data.creator.id}};
            }

            this.variablesManager.set('controller-variables', {filter: filters});
            this.reset();
        });

    }

    public pagination(event: NaturalPageEvent) {

        if (this.viewMode === ViewMode.grid) {
            this.persistSearch = false;
            super.pagination(event);
            this.persistSearch = true;
        } else {
            super.pagination(event);
        }
    }

    /**
     * Persist list rendering in session storage.
     */
    public setViewMode(mode: ViewMode) {
        this.viewMode = mode;
        sessionStorage.setItem('view-mode', mode);
    }

    public sorting(event: Sort[]) {
        // this.reset();
        super.sorting(event);
    }

    /**
     * Return the only activated View Component
     */
    private getViewComponent() {
        return this.gridComponent || this.listComponent || this.mapComponent;
    }

    /**
     * Show a button to download a collection, considering permissions
     */
    public updateShowDownloadCollection() {
        const roles = this.route.snapshot.data.showDownloadCollectionForRoles;
        const roleIsAllowed = this.user && this.user.role && (!roles || roles && roles.indexOf(this.user.role) > -1);
        const hasCollection = this.collection && this.collection.id;
        this.showDownloadCollection = hasCollection && roleIsAllowed;
    }

    public select(items) {
        this.selected = items;
    }

    public reset() {
        this.selected = [];
        // if (this.gallery && this.gallery.gallery) {
        //     this.gallery.gallery.clear();
        // }
    }

    public reload() {
        // if (this.sub) {
        // this.reset();
        // this.sub.refetch();
        // }

        this.router.navigateByUrl('/empty', {skipLocationChange: true})
            .then(() => this.router.navigate(['.'], {relativeTo: this.route}));
    }

    public linkSelectionToCollection(selection) {
        this.linkToCollection({images: selection});
    }

    public linkCollectionToCollection(collection) {
        this.linkToCollection({collection});
    }

    public downloadSelection(selection) {
        this.download({images: selection});
    }

    public downloadCollection(collection) {
        this.download({collection});
    }

    public unlinkFromCollection(selection) {

        if (!this.collection) {
            return;
        }

        this.collectionService.unlink(this.collection, selection).subscribe(() => {
            this.alertService.info('Les images ont été retirées');
            this.reload();
        });
    }

    public delete(selection) {
        this.alertService.confirm('Suppression', 'Voulez-vous supprimer définitivement cet/ces élément(s) ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.cardService.delete(selection).subscribe(() => {
                        this.alertService.info('Supprimé');
                        this.reload();
                    });
                }
            });
    }

    public goToQuizz(selected = null) {

        if (selected) {
            selected = UtilityService.shuffleArray(selected.map(e => e.id)).join(',');
            this.router.navigateByUrl('/quizz;cards=' + selected);
        } else {
            // open box, ask for number of items to display in quizz, and get randomized list pageIndex:0, pageSize:nbItems; sort: random'
            this.dialog.open(NumberSelectorComponent, {
                width: '200px',
                position: {
                    top: '74px',
                    right: '10px',
                },
            }).afterClosed().subscribe(number => {
                if (number > 0) {
                    const quizzVars = new NaturalQueryVariablesManager(this.variablesManager);
                    quizzVars.set('sorting', {sorting: [{field: CardSortingField.random}]});
                    quizzVars.set('pagination', {pagination: {pageIndex: 0, pageSize: +number}});
                    this.cardService.getAll(quizzVars).subscribe(cards => {
                        this.router.navigateByUrl('quizz;cards=' + cards.items.map(e => e.id).join(','));
                    });
                }
            });
        }
    }

    public edit(selected) {
        const selection = selected.filter(card => card.permissions.update);

        this.dialog.open(MassEditComponent, {
            width: '440px',
        }).afterClosed().subscribe(model => {

            if (!model) {
                return;
            }

            const changeAttributes = pickBy(model, (value, key) => {
                return isString(value) && value !== '' || isArray(value) && value.length > 0;
            });

            const observables = [];
            for (const s of selection) {
                const changes = clone(changeAttributes);
                defaults(changes, s);
                if (changes.artists) {
                    changes.artists = changes.artists.map(a => a.name ? a.name : a);
                }
                if (changes.institution) {
                    changes.institution = changes.institution.name ? changes.institution.name : changes.institution;
                }
                observables.push(this.cardService.update(changes));
            }

            forkJoin(observables).subscribe(() => {
                this.alertService.info('Mis à jour');
                this.reload();
            });
        });

    }

    public selectAll() {
        this.selected = this.getViewComponent().selectAll();
    }

    public unselectAll() {
        this.selected.length = [];
        this.getViewComponent().unselectAll();
    }

    private linkToCollection(selection) {
        this.dialog.open(CollectionSelectorComponent, {
            width: '400px',
            position: {
                top: '74px',
                right: '10px',
            },
            data: selection,
        });
    }

    private download(selection) {
        const data = merge({denyLegendsDownload: !this.user}, selection);

        this.dialog.open(DownloadComponent, {
            width: '400px',
            data,
        });
    }

    /**
     * Push admin config, but only if it does not already exist
     */
    private pushAdminConfig(): void {
        if (!this.naturalSearchFacets.some(conf => conf === adminConfig[0])) {
            this.naturalSearchFacets = cardsConfiguration.concat(adminConfig);
        }
    }

}
