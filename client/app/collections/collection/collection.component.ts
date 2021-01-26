import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {findKey} from 'lodash-es';
import {InstitutionService} from '../../institutions/services/institution.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {
    Collection_collection_institution,
    CollectionVisibility,
    UpdateCollection_updateCollection,
    UpdateCollection_updateCollection_institution,
    UserRole,
    Users_users_items,
} from '../../shared/generated-types';
import {collectionsHierarchicConfig} from '../../shared/hierarchic-configurations/CollectionConfiguration';
import {UserService} from '../../users/services/user.service';
import {CollectionService} from '../services/collection.service';
import {MatSliderChange} from '@angular/material/slider';
import {Visibilities} from '../../card/card.component';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
})
export class CollectionComponent extends AbstractDetailDirective<CollectionService> implements OnInit {
    public visibility = 1;
    public visibilities: Visibilities<CollectionVisibility> = {
        1: {
            value: CollectionVisibility.private,
            text: 'par moi et les abonnés',
            color: undefined,
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

    public institution: Collection_collection_institution | UpdateCollection_updateCollection_institution | null = null;

    public hierarchicConfig = collectionsHierarchicConfig;

    public showVisibility = true;

    constructor(
        public institutionService: InstitutionService,
        public collectionService: CollectionService,
        public userService: UserService,
        alertService: AlertService,
        dialogRef: MatDialogRef<CollectionComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
    ) {
        super(collectionService, alertService, dialogRef, userService, data);
    }

    public updateVisibility(ev: MatSliderChange): void {
        // @ts-ignore
        this.data.item.visibility = this.visibilities[ev.value].value;
    }

    /**
     * Visibility is seen by >=seniors if they are the creator, or by admins if visibility is set to admin.
     */
    public computeShowVisibility(): boolean {
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

        const collectionIsNotPrivate =
            this.data.item.visibility === CollectionVisibility.administrator ||
            this.data.item.visibility === CollectionVisibility.member;

        // If is admin and has visibility
        return this.user.role === UserRole.administrator && collectionIsNotPrivate;
    }

    public displayFn(item: Users_users_items | string): string {
        return item && typeof item !== 'string' ? item.login : '';
    }

    protected postQuery(): void {
        // Init visibility
        this.visibility = +findKey(this.visibilities, s => s.value === this.data.item.visibility);

        this.institution = this.data.item.institution;

        this.showVisibility = this.computeShowVisibility();
    }

    protected postUpdate(model: UpdateCollection_updateCollection): void {
        this.institution = model.institution;
    }
}
