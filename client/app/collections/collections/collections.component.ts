import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Literal, NaturalAbstractController, NaturalQueryVariablesManager } from '@ecodev/natural';
import { isArray } from 'lodash';
import { CollectionsVariables, UserRole } from '../../shared/generated-types';
import { UserService } from '../../users/services/user.service';
import { CollectionComponent } from '../collection/collection.component';
import { CollectionService } from '../services/collection.service';

@Component({
    selector: 'app-collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent extends NaturalAbstractController implements OnInit {

    public collections = [];

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
    public user;
    public hasMore = false;
    public showEditButtons = true;
    private queryVariables = new NaturalQueryVariablesManager<CollectionsVariables>();
    private pageSize = 50;

    private defaultVariables: CollectionsVariables = {
        filter: {groups: [{conditions: [{parent: {empty: {}}}]}]},
    };

    constructor(private route: ActivatedRoute,
                private router: Router,
                private collectionsService: CollectionService,
                private dialog: MatDialog,
                private userSvc: UserService) {
        super();
    }

    ngOnInit() {

        this.userSvc.getCurrentUser().subscribe(user => {
            this.user = user;
            this.showEditButtons = this.showEditionButtons();
            this.canCreate = this.showCreateButton(this.route.snapshot.data.creationButtonForRoles, this.user);

        });

        this.queryVariables.set('variables', this.defaultVariables);
        this.queryVariables.set('pagination', {pagination: {pageIndex: 0, pageSize: this.pageSize}});

        this.route.data.subscribe((data: Literal) => {
            this.canCreate = this.showCreateButton(data.creationButtonForRoles, this.user);
            this.showUnclassified = data.showUnclassified;
            this.showMyCards = data.showMyCards;

            this.queryVariables.set('route-context', {filter: data.filter ? data.filter : {}});

            if (data.creator) {
                this.queryVariables.set('creator', {filter: {groups: [{conditions: [{creator: {in: {values: [data.creator.id]}}}]}]}});
            }

        });

        this.collectionsService.watchAll(this.queryVariables, this.ngUnsubscribe).subscribe((collections: any) => {
            if (collections.pageIndex === 0) {
                this.collections = collections.items;
            } else {
                this.collections = this.collections.concat(collections.items);
            }
            this.hasMore = collections.length > this.collections.length;
        });

    }

    public showEditionButtons() {
        const authorizedRoles = this.route.snapshot.data.editionButtonsForRoles;
        if (!authorizedRoles) {
            return true;
        }

        return authorizedRoles.indexOf(this.user.role) > -1;
    }

    public search(term) {
        this.queryVariables.set('search', {filter: {groups: [{conditions: [{custom: {search: term}}]}]}});
    }

    public more() {
        const nextPage = this.queryVariables.variables.value.pagination.pageIndex + 1;
        this.queryVariables.set('pagination', {pagination: {pageIndex: nextPage}});
    }

    public edit(event, collection) {
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

    public add() {
        this.dialog.open(CollectionComponent, {width: '800px'});
    }

    private showCreateButton(allowedRoles: boolean | UserRole[], user) {

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
