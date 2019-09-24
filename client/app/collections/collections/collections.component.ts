import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { isArray } from 'lodash';
import { CollectionsQueryVariables, UserRole } from '../../shared/generated-types';
import { IncrementSubject } from '../../shared/services/increment-subject';
import { Literal } from '../../shared/types';
import { UserService } from '../../users/services/user.service';
import { CollectionComponent } from '../collection/collection.component';
import { CollectionService } from '../services/collection.service';

@Component({
    selector: 'app-collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {

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
    public searchedTerm;
    public user;
    public hasMore = false;
    public showEditButtons = true;
    private queryVariables = new IncrementSubject<CollectionsQueryVariables>();
    private pageSize = 50;
    private defaultFilters = {
        filters: {
            search: '',
            parents: [],
        },
        pagination: {
            pageIndex: 0,
            pageSize: this.pageSize,
        },
    };

    constructor(private route: ActivatedRoute,
                private router: Router,
                private collectionsSvc: CollectionService,
                private dialog: MatDialog,
                private userSvc: UserService) {
    }

    ngOnInit() {

        this.userSvc.getCurrentUser().subscribe(user => {
            this.user = user;
            this.showEditButtons = this.showEditionButtons();
            this.canCreate = this.showCreateButton(this.route.snapshot.data.creationButtonForRoles, this.user);

        });

        this.queryVariables.patch(this.defaultFilters);
        this.route.data.subscribe((data: Literal) => {
            this.canCreate = this.showCreateButton(data.creationButtonForRoles, this.user);
            this.showUnclassified = data.showUnclassified;
            this.showMyCards = data.showMyCards;

            const filters = data.filters ? data.filters : {};

            if (data.creator) {
                filters.creators = [data.creator.id];
            }

            this.queryVariables.patch({filters: filters});
        });

        const queryRef = this.collectionsSvc.watchAll(this.queryVariables);
        queryRef.valueChanges.subscribe((collections: any) => {
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
        this.queryVariables.patch({filters: {search: term}});
    }

    public more() {
        const nextPage = this.queryVariables.getValue().pagination.pageIndex + 1;
        this.queryVariables.patch({pagination: {pageIndex: nextPage}});
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
        this.dialog.open(CollectionComponent, {
            width: '800px',
        });
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
