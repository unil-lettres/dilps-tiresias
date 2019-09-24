import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollectionService } from '../services/collection.service';
import { AlertService } from '../../shared/components/alert/alert.service';
import { InstitutionService } from '../../institutions/services/institution.service';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { UserService } from '../../users/services/user.service';
import { CollectionVisibility, UserRole } from '../../shared/generated-types';
import { findKey } from 'lodash';

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

    constructor(public institutionSvc: InstitutionService,
                service: CollectionService,
                userSvc: UserService,
                alertSvc: AlertService,
                dialogRef: MatDialogRef<CollectionComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        super(service, alertSvc, dialogRef, userSvc, data);
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

    public updateVisibility(ev) {
        this.data.item.visibility = this.visibilities[ev.value].value;
    }

    /**
     * Visibility is seen by >=seniors if their are the creator, or by admins if visibility is set to admin.
     * @returns {boolean}
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
}
