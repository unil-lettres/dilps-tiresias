import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NaturalIconDirective, NaturalQueryVariablesManager} from '@ecodev/natural';
import {HistoricIconComponent} from '../../shared/components/historic-icon/historic-icon.component';
import {
    CollectionsQuery,
    CollectionsQueryVariables,
    LogicalOperator,
    SearchOperatorString,
    UserRole,
    ViewerQuery,
} from '../../shared/generated-types';
import {CollectionComponent} from '../collection/collection.component';
import {CollectionService} from '../services/collection.service';
import {MatDivider} from '@angular/material/divider';
import {MatListItem, MatListItemIcon, MatListItemMeta, MatListItemTitle, MatNavList} from '@angular/material/list';
import {NgScrollbar} from 'ngx-scrollbar';
import {MatIcon} from '@angular/material/icon';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIconButton} from '@angular/material/button';
import {NgTemplateOutlet} from '@angular/common';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbar} from '@angular/material/toolbar';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-collections',
    imports: [
        MatToolbar,
        LogoComponent,
        NgTemplateOutlet,
        MatIconButton,
        MatTooltip,
        HideTooltipDirective,
        MatIcon,
        NgScrollbar,
        MatNavList,
        MatListItem,
        MatListItemIcon,
        MatListItemTitle,
        MatListItemMeta,
        RouterLinkActive,
        RouterLink,
        MatDivider,
        RouterOutlet,
        NaturalIconDirective,
        HistoricIconComponent,
    ],
    templateUrl: './collections.component.html',
    styleUrl: './collections.component.scss',
})
export class CollectionsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly collectionsService = inject(CollectionService);
    private readonly dialog = inject(MatDialog);

    private readonly destroyRef = inject(DestroyRef);

    protected rootCollections: CollectionsQuery['collections']['items'][0][] = [];

    /**
     * Children by parent ID
     */
    protected readonly children = new Map<string, CollectionsQuery['collections']['items'][0][]>();

    /**
     * Show "unclassified" category on the top of the page
     */
    protected showUnclassified = false;

    /**
     * Show "my cards" category on the top of the page
     */
    protected showMyCards = false;

    /**
     * Title for the page
     */
    protected title = '';

    /**
     * Can create permissions
     */
    protected canCreate = false;
    protected user: ViewerQuery['viewer'] | null = null;
    protected hasMore = false;
    private queryVariables = new NaturalQueryVariablesManager<CollectionsQueryVariables>();
    private pageSize = 50;

    private defaultVariables: CollectionsQueryVariables = {
        filter: {groups: [{conditions: [{parent: {empty: {}}}]}]},
    };

    private readonly routeData$ = this.route.data.pipe(takeUntilDestroyed());

    private readonly collectionsService$ = this.collectionsService
        .watchAll(this.queryVariables)
        .pipe(takeUntilDestroyed());

    public ngOnInit(): void {
        this.queryVariables.set('variables', this.defaultVariables);
        this.queryVariables.set('pagination', {pagination: {pageIndex: 0, pageSize: this.pageSize}});

        this.routeData$.subscribe(data => {
            // data.creator is the logged in user here.

            this.canCreate = this.showCreateButton(data.creationButtonForRoles, data.creator);
            this.showUnclassified = data.showUnclassified;
            this.showMyCards = data.showMyCards;
            this.title = data.title || '';

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

        this.collectionsService$.subscribe(collections => {
            if (collections.pageIndex === 0) {
                this.rootCollections = collections.items;
            } else {
                this.rootCollections = this.rootCollections.concat(collections.items);
            }

            this.hasMore = collections.length > this.rootCollections.length;
        });

        // Watch route changes to expand parent collections when a child is active
        this.router.events
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe(() => {
                this.expandActiveCollection();
            });

        // Also check on initial load
        this.expandActiveCollection();
    }

    private expandActiveCollection(): void {
        const childRoute = this.route.firstChild;
        if (!childRoute) {
            return;
        }

        const collectionId = childRoute.snapshot.params.id;
        if (!collectionId) {
            return;
        }

        console.log('Expanding parents for collection:', collectionId);

        this.collectionsService.getOne(collectionId).subscribe(collection => {
            console.log('Collection loaded:', collection);
            if (collection.parent) {
                console.log('Has parent:', collection.parent);
                this.expandParentsRecursively(collection.parent.id);
            }
        });
    }

    protected toggle(collection: CollectionsQuery['collections']['items'][0]): void {
        if (this.children.has(collection.id)) {
            this.children.delete(collection.id);
        } else {
            this.getChildren(collection);
        }
    }

    private getChildren(collection: CollectionsQuery['collections']['items'][0]): void {
        const qvm = new NaturalQueryVariablesManager<CollectionsQueryVariables>();
        qvm.set('variables', {filter: {groups: [{conditions: [{parent: {equal: {value: collection.id}}}]}]}});

        this.collectionsService
            .watchAll(qvm)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(results => {
                this.children.set(collection.id, results.items);
            });
    }

    /**
     * Recursively expand all parent collections by loading them from the API
     */
    private expandParentsRecursively(parentId: string): void {
        console.log('expandParentsRecursively called for:', parentId);

        // Check if parent is already expanded
        if (this.children.has(parentId)) {
            console.log('Parent already expanded:', parentId);
            return;
        }

        // Load the parent to get its information
        this.collectionsService.getOne(parentId).subscribe(parent => {
            console.log('Parent loaded:', parent);

            // Load the children of this parent to display them
            const qvm = new NaturalQueryVariablesManager<CollectionsQueryVariables>();
            qvm.set('variables', {filter: {groups: [{conditions: [{parent: {equal: {value: parentId}}}]}]}});

            this.collectionsService
                .watchAll(qvm)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(results => {
                    console.log('Children loaded for parent:', parentId, results.items);
                    this.children.set(parentId, results.items);
                });

            // If this parent has a parent too, expand it recursively
            if (parent.parent) {
                console.log('Parent has grandparent:', parent.parent);
                this.expandParentsRecursively(parent.parent.id);
            }
        });
    }

    /**
     * Find a collection by ID in rootCollections or children
     */
    private findCollection(id: string): CollectionsQuery['collections']['items'][0] | undefined {
        // Search in root collections
        const rootCollection = this.rootCollections.find(c => c.id === id);
        if (rootCollection) {
            return rootCollection;
        }

        // Search in all children
        for (const childrenList of this.children.values()) {
            const found = childrenList.find(c => c.id === id);
            if (found) {
                return found;
            }
        }

        return undefined;
    }

    protected search(term: SearchOperatorString): void {
        this.queryVariables.set('search', {filter: {groups: [{conditions: [{custom: {search: term}}]}]}});
    }

    protected more(): void {
        const nextPage = this.queryVariables.variables.value!.pagination!.pageIndex! + 1;
        this.queryVariables.merge('pagination', {pagination: {pageIndex: nextPage}});
    }

    protected edit(event: MouseEvent, collection: CollectionsQuery['collections']['items'][0]): void {
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

    protected add(): void {
        this.dialog.open(CollectionComponent, {width: '800px'});
    }

    private showCreateButton(allowedRoles: boolean | UserRole[], user: ViewerQuery['viewer'] | null): boolean {
        if (!allowedRoles || !user) {
            return false;
        }

        if (allowedRoles === true) {
            return true;
        }

        if (Array.isArray(allowedRoles) && allowedRoles.length) {
            for (const allowedRole of allowedRoles) {
                if (allowedRole === user.role) {
                    return true;
                }
            }
        }

        return false;
    }
}
