import { forkJoin } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../card/services/card.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalGalleryComponent } from '@ecodev/angular-natural-gallery';
import { fromUrl, NaturalSearchFacets, NaturalSearchSelections, toGraphQLDoctrineFilter, toUrl } from '@ecodev/natural';
import { NaturalGalleryOptions } from '@ecodev/natural-gallery-js';
import { clone, defaults, isArray, isString, merge, pickBy } from 'lodash';
import { DownloadComponent } from '../shared/components/download/download.component';
import { debounceTime } from 'rxjs/operators';

import { adminConfig, cardsConfiguration } from '../shared/natural-search-configurations';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { MatDialog } from '@angular/material';
import { CollectionSelectorComponent } from '../shared/components/collection-selector/collection-selector.component';
import { CollectionService } from '../collections/services/collection.service';
import { AlertService } from '../shared/components/alert/alert.service';
import { UserService } from '../users/services/user.service';
import { UtilityService } from '../shared/services/utility.service';
import { NumberSelectorComponent } from '../quizz/shared/number-selector/number-selector.component';
import { MassEditComponent } from '../shared/components/mass-edit/mass-edit.component';

import { NaturalGalleryComponent } from '@ecodev/angular-natural-gallery';
import {
    fromUrl,
    NaturalSearchConfiguration,
    NaturalSearchSelections,
    toGraphQLDoctrineFilter,
    toUrl,
} from '@ecodev/natural-search';
import { QueryVariablesManager } from '../shared/classes/query-variables-manager';
import { CardFilter, CardSortingField, SortingOrder, UserRole, ViewerQuery } from '../shared/generated-types';
import { PersistenceService } from '../shared/services/persistence.service';
import { NaturalGalleryOptions } from '@ecodev/natural-gallery-js';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

    @ViewChild('gallery', {static: true}) gallery: NaturalGalleryComponent;
    @ViewChild('scrollable', {static: true}) private scrollable: PerfectScrollbarComponent;

    public SortingOrder = SortingOrder;
    public galleryCollection = null;
    public selected;

    public showLogo = true;

    private thumbnailHeight = 300;
    private enlargedHeight = 2000;
    private sub;

    public options: NaturalGalleryOptions = {
        cover: true,
        gap: 5,
        showLabels: 'always',
        rowHeight: this.thumbnailHeight,
        activable: true,
        selectable: true,
        lightbox: true,
        infiniteScrollOffset: -200,
    };

    public collection;

    public user: ViewerQuery['viewer'];

    public searchedTerm;

    public lastUpload;

    public showDownloadCollection = true;

    public config: NaturalSearchFacets = cardsConfiguration;

    public selections: NaturalSearchSelections = [[]];

    private variablesManager: QueryVariablesManager = new QueryVariablesManager();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cardSvc: CardService,
                private dialog: MatDialog,
                private collectionSvc: CollectionService,
                private alertSvc: AlertService,
                private userSvc: UserService,
                private persistenceSvc: PersistenceService) {
    }

    ngOnInit() {

        this.userSvc.getCurrentUser().subscribe(user => {
            this.user = user;
            this.updateShowDownloadCollection();

            if (this.user.role === UserRole.administrator) {
                this.pushAdminConfig();
            }

        });

        this.route.queryParams.subscribe(() => {
            this.initFromUrl();
        });

        this.route.params.subscribe(params => {

            if (params.upload && params.upload !== this.lastUpload) {
                this.reload();
            }

            if (params.collectionId) {

                this.collection = {
                    id: params.collectionId,
                    __typename: 'Collection',
                };

                const filter: CardFilter = {groups: [{conditions: [{collections: {have: {values: [params.collectionId]}}}]}]};
                this.variablesManager.set('collection', {filter: filter});
                this.reset();
            }
        });

        this.route.data.subscribe(data => {

            this.showLogo = data.showLogo;
            this.updateShowDownloadCollection();

            if (data.filter) {
                this.variablesManager.set('route-context', {filter: data.filter});
            }

            // const contextFields: CardFilterConditionFields[] = [{filename: {equal: {value: '', not: true}}}];
            const filters: CardFilter = {
                groups: [{conditions: [{filename: {equal: {value: '', not: true}}}]}],
            };

            if (data.creator && !this.collection) {
                filters.groups[filters.groups.length - 1].conditions[0].creator = {equal: {value: data.creator.id}};
            }

            this.variablesManager.set('controller-variables', {filter: filters});
            this.reset();
        });

    }

    private initFromUrl() {
        let naturalSearchSelections = this.persistenceSvc.getFromUrl('natural-search', this.route);
        const sorting = this.persistenceSvc.getFromUrl('sorting', this.route);

        // prevent null value that is actually not supported
        naturalSearchSelections = naturalSearchSelections ? fromUrl(naturalSearchSelections) : [[]];

        const containAdminSelection = naturalSearchSelections.some(selection => {
            return selection.some(value => {
                return adminConfig.some(config => {
                    return config.field === value.field;
                });
            });
        });

        if (containAdminSelection) {
            this.pushAdminConfig();
        }

        this.selections = naturalSearchSelections;
        if (this.hasSelections(this.selections)) {
            this.translateSearchAndUpdate(naturalSearchSelections);
        }
        this.variablesManager.set('sorting', sorting);
    }

    public sort(field: string, direction: SortingOrder) {

        this.reset();

        let sorting = {
            sorting: [
                {
                    field: 'creationDate',
                    order: SortingOrder.DESC,
                },
                {
                    field: 'id',
                    order: SortingOrder.ASC,
                },
            ],
        };

        // If field but different from default (creationDate), don't add to url
        if (field && field !== 'creationDate') {
            sorting = {
                sorting: [
                    {
                        field: field,
                        order: direction,
                    },
                    {
                        field: 'id',
                        order: SortingOrder.ASC,
                    },
                ],
            };
            this.persistenceSvc.persistInUrl('sorting', sorting, this.route);
        } else {
            this.persistenceSvc.persistInUrl('sorting', null, this.route);
        }

        this.variablesManager.set('sorting', sorting);
    }

    public updateShowDownloadCollection() {
        const roles = this.route.snapshot.data.showDownloadCollectionForRoles;
        const roleIsAllowed = this.user && this.user.role && (!roles || roles && roles.indexOf(this.user.role) > -1);
        const hasCollection = this.collection && this.collection.id;
        this.showDownloadCollection = hasCollection && roleIsAllowed;
    }

    private formatImages(cards) {

        cards = cards.map(card => {
            let thumb = CardService.formatImage(card, this.thumbnailHeight);
            let big = CardService.formatImage(card, this.enlargedHeight);

            thumb = {
                thumbnailSrc: thumb.src,
                thumbnailWidth: thumb.width,
                thumbnailHeight: thumb.height,
            };

            big = {
                enlargedSrc: big.src,
                enlargedWidth: big.width,
                enlargedHeight: big.height,
            };

            let title = card.name ? card.name : null;
            const artists = card.artists.map(a => a.name).join('<br/>');

            if (artists && title) {
                title = '[ ' + artists + ' ] ' + title;
            } else if (artists && !title) {
                title = artists;
            }

            const fields: any = {
                title: title ? title : 'Voir le détail',
            };

            return merge({}, card, thumb, big, fields);
        });

        return cards;
    }

    public activate(event) {
        console.log('activate', event);
        this.router.navigate([
            'card',
            event.model.id,
        ]);
    }

    public select(items) {
        this.selected = items;
    }

    public reset() {
        this.selected = [];
        if (this.gallery && this.gallery.gallery) {
            this.gallery.gallery.clear();
        }
    }

    public reload() {
        if (this.sub) {
            this.reset();
            this.sub.refetch();
        }
    }

    public search(selections: NaturalSearchSelections) {
        // Persist in url before translation to graphql
        this.persistenceSvc.persistInUrl('natural-search', toUrl(selections), this.route);
        this.translateSearchAndUpdate(selections);
    }

    /**
     *
     * @param {NaturalSearchSelections} selections
     */
    private translateSearchAndUpdate(selections: NaturalSearchSelections) {

        // Convert to graphql and update query variables
        const translatedSelection = toGraphQLDoctrineFilter(this.config, selections);

        this.reset();
        this.variablesManager.set('natural-search', {filter: translatedSelection});
    }

    /**
     * Return true wherever natural-search has selection or not.
     * Natural-search actual "no value" equals [[]]
     * @param selections
     * @returns {boolean}
     */
    private hasSelections(selections): boolean {
        return !!selections.filter(e => e.length).length; // because empty natural search return [[]]
    }

    public loadMore(ev) {

        this.variablesManager.set('pagination', {pagination: {offset: ev.offset, pageSize: ev.limit}});

        if (!this.sub) {
            this.sub = this.cardSvc.watchAll(this.variablesManager.variables.pipe(debounceTime(5)));
            this.sub.valueChanges.subscribe(data => {
                if (this.gallery) {
                    this.gallery.gallery.addItems(this.formatImages(data.items));
                }
            });
        }
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

    public linkSelectionToCollection(selection) {
        this.linkToCollection({images: selection});
    }

    public linkCollectionToCollection(collection) {
        this.linkToCollection({collection});
    }

    private download(selection) {
        const data = merge({denyLegendsDownload: !this.user}, selection);

        this.dialog.open(DownloadComponent, {
            width: '400px',
            data,
        });
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

        this.collectionSvc.unlink(this.collection, selection).subscribe(() => {
            this.alertSvc.info('Les images ont été retirées');
            this.reload();
        });
    }

    public delete(selection) {
        this.alertSvc.confirm('Suppression', 'Voulez-vous supprimer définitivement cet/ces élément(s) ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.cardSvc.delete(selection).subscribe(() => {
                        this.alertSvc.info('Supprimé');
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
                    const quizzVars = clone(this.variablesManager.variables.value);
                    quizzVars.sorting = [{field: CardSortingField.random}];
                    quizzVars.pagination.pageIndex = 0;
                    quizzVars.pagination.pageSize = +number;
                    this.cardSvc.getAll(quizzVars).subscribe(cards => {
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
                observables.push(this.cardSvc.update(changes as { id: any }));
            }

            forkJoin(observables).subscribe(() => {
                this.alertSvc.info('Mis à jour');
                this.reload();
            });
        });

    }

    public selectAll() {
        this.selected = this.gallery.gallery.selectVisibleItems();
    }

    public unselectAll() {
        this.gallery.gallery.unselectAllItems();
        this.selected.length = [];
    }

    /**
     * Push admin config, but only if it does not already exist
     */
    private pushAdminConfig(): void {
        if (!this.config.some(conf => conf === adminConfig[0])) {
            this.config = cardsConfiguration.concat(adminConfig);
        }
    }

}
