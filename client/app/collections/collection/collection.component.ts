import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { findKey } from 'lodash';
import { InstitutionService } from '../../institutions/services/institution.service';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../shared/components/alert/alert.service';
import { CollectionVisibility, UserRole } from '../../shared/generated-types';
import { collectionsHierarchicConfig } from '../../shared/hierarchic-configurations/CollectionConfiguration';
import { UserService } from '../../users/services/user.service';
import { CollectionService } from '../services/collection.service';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
})
export class CollectionComponent extends AbstractDetail implements OnInit {

    public visibility = 1;
    public visibilities = {
        1: {
            value: CollectionVisibility.private,
            text: 'par moi et les abonnés',
            color: null,
        },
        2: {
            value: CollectionVisibility.administrator,
            text: 'par moi, les admins et les abonnés',
            color: 'accent',
        },
        3: {
            value: CollectionVisibility.member,
            text: 'par les membres',
            color: 'primary',
        },
    };

    public institution;

    public hierarchicConfig = collectionsHierarchicConfig;

    public showVisibility = true;

    constructor(public institutionService: InstitutionService,
                public collectionService: CollectionService,
                public userService: UserService,
                alertService: AlertService,
                dialogRef: MatDialogRef<CollectionComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        super(collectionService, alertService, dialogRef, userService, data);
    }

    public updateVisibility(ev) {
        this.data.item.visibility = this.visibilities[ev.value].value;
    }

    /**
     * Visibility is seen by >=seniors if they are the creator, or by admins if visibility is set to admin.
     */
    public computeShowVisibility() {

        // While no user loaded
        if (!this.user) {
            return false;
        }

        const hasCreator = !!this.data.item.creator;
        const isCreator = hasCreator && this.user.id === this.data.item.creator.id;
        const isOwner = isCreator && [UserRole.senior, UserRole.administrator, UserRole.major].includes(this.user.role);

        if (isOwner) {
            return true;
        }

        const collectionIsNotPrivate = this.data.item.visibility === CollectionVisibility.administrator ||
                                       this.data.item.visibility === CollectionVisibility.member;

        // If is admin and has visibility
        return this.user.role === UserRole.administrator && collectionIsNotPrivate;
    }

    public displayFn(item) {
        return item ? item.login : null;
    }

    protected postQuery() {
        // Init visibility
        this.visibility = +findKey(this.visibilities, (s) => s.value === this.data.item.visibility);

        this.institution = this.data.item.institution;

        this.showVisibility = this.computeShowVisibility();
    }

    protected postUpdate(model) {
        this.institution = model.institution;
    }
}
