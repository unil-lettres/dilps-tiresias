import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {NaturalAbstractController, NaturalQueryVariablesManager} from '@ecodev/natural';
import {isArray} from 'lodash-es';
import {
    Collections_collections_items,
    CollectionsVariables,
    LogicalOperator,
    SearchOperatorString,
    UserRole,
    Viewer_viewer,
} from '../../shared/generated-types';
import {CollectionComponent} from '../collection/collection.component';
import {CollectionService} from '../services/collection.service';

@Component({
    selector: 'app-collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent extends NaturalAbstractController implements OnInit {
    public rootCollections: Collections_collections_items[] = [];

    /**
     * Children by parent ID
     */
    public readonly children = new Map<string, Collections_collections_items[]>();

    /**
     * Show "unclassified" category on the top of the page
     */
    public showUnclassified = false;

    /**
     * Show "my cards" category on the top of the page
     */
    public showMyCards = false;

    /**
     * Can create permissions
     */
    public canCreate = false;
    public user: Viewer_viewer | null = null;
    public hasMore = false;
    private queryVariables = new NaturalQueryVariablesManager<CollectionsVariables>();
    private pageSize = 50;

    private defaultVariables: CollectionsVariables = {
        filter: {groups: [{conditions: [{parent: {empty: {}}}]}]},
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private collectionsService: CollectionService,
        private dialog: MatDialog,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.queryVariables.set('variables', this.defaultVariables);
        this.queryVariables.set('pagination', {pagination: {pageIndex: 0, pageSize: this.pageSize}});

        this.route.data.subscribe(data => {
            // data.creator is the logged in user here.

            this.canCreate = this.showCreateButton(data.creationButtonForRoles, data.creator);
            this.showUnclassified = data.showUnclassified;
            this.showMyCards = data.showMyCards;

            this.queryVariables.set('route-context', {filter: data.filter ? data.filter : {}});

            if (data.creator) {
                this.queryVariables.set('creator', {
                    filter: {
                        groups: [
                            {conditions: [{owner: {in: {values: [data.creator.id]}}}]},
                            {
                                groupLogic: LogicalOperator.OR,
                                conditions: [{users: {have: {values: [data.creator.id]}}}],
                            },
                        ],
                    },
                });
            }
        });

        this.collectionsService.watchAll(this.queryVariables, this.ngUnsubscribe).subscribe(collections => {
            if (collections.pageIndex === 0) {
                this.rootCollections = collections.items;
            } else {
                this.rootCollections = this.rootCollections.concat(collections.items);
            }

            this.hasMore = collections.length > this.rootCollections.length;
        });
    }

    public toggle(collection: Collections_collections_items): void {
        if (this.children.has(collection.id)) {
            this.children.delete(collection.id);
        } else {
            this.getChildren(collection);
        }
    }

    private getChildren(collection: Collections_collections_items): void {
        const qvm = new NaturalQueryVariablesManager<CollectionsVariables>();
        qvm.set('variables', {filter: {groups: [{conditions: [{parent: {equal: {value: collection.id}}}]}]}});

        this.collectionsService.watchAll(qvm, this.ngUnsubscribe).subscribe(results => {
            this.children.set(collection.id, results.items);
        });
    }

    public search(term: SearchOperatorString): void {
        this.queryVariables.set('search', {filter: {groups: [{conditions: [{custom: {search: term}}]}]}});
    }

    public more(): void {
        const nextPage = this.queryVariables.variables.value.pagination.pageIndex + 1;
        this.queryVariables.merge('pagination', {pagination: {pageIndex: nextPage}});
    }

    public edit(event: MouseEvent, collection: Collections_collections_items): void {
        event.preventDefault();
        event.stopPropagation();

        const dialogRef = this.dialog.open(CollectionComponent, {
            width: '800px',
            data: {item: collection},
        });

        dialogRef.afterClosed().subscribe(data => {
            // if returned data is null, it means deletion
            if (data === null) {
                this.router.navigate(['..'], {relativeTo: this.route.firstChild});
            }
        });
    }

    public add(): void {
        this.dialog.open(CollectionComponent, {width: '800px'});
    }

    private showCreateButton(allowedRoles: boolean | UserRole[], user: Viewer_viewer | null): boolean {
        if (!allowedRoles || !user) {
            return false;
        }

        if (allowedRoles === true) {
            return true;
        }

        if (isArray(allowedRoles) && allowedRoles.length) {
            for (const allowedRole of allowedRoles) {
                if (allowedRole === user.role) {
                    return true;
                }
            }
        }

        return false;
    }
}
