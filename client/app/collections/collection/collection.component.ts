import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { findKey } from 'lodash';
import { InstitutionService } from '../../institutions/services/institution.service';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../shared/components/alert/alert.service';
import { CollectionVisibility, UserRole } from '../../shared/generated-types';
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
            text: 'par moi',
            color: null,
        },
        2: {
            value: CollectionVisibility.administrator,
            text: 'par moi et les admins',
            color: 'accent',
        },
        3: {
            value: CollectionVisibility.member,
            text: 'par tout le monde',
            color: 'primary',
        },
    };

    public institution;

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
     * Visibility is seen by >=seniors if their are the creator, or by admins if visibility is set to admin.
     */
    public showVisibility() {

        // While no user loaded
        if (!this.user) {
            return false;
        }

        const hasCreator = !!this.data.item.creator;
        const isCreator = hasCreator && this.user.id === this.data.item.creator.id;
        const isOwner = isCreator && this.user.role === UserRole.senior || isCreator && this.user.role === UserRole.administrator;

        if (isOwner) {
            return true;
        }

        const collectionIsNotPrivate = this.data.item.visibility === CollectionVisibility.administrator ||
                                       this.data.item.visibility === CollectionVisibility.member;

        // If is admin and has visibility
        return this.user.role === UserRole.administrator && collectionIsNotPrivate;
    }

    protected postQuery() {
        // Init visibility
        this.visibility = +findKey(this.visibilities, (s) => {
            return s.value === this.data.item.visibility;
        });

        this.institution = this.data.item.institution;
    }

    protected postUpdate(model) {
        this.institution = model.institution;
    }

    public displayFn(item) {
        return item ? item.login : null;
    }
}
