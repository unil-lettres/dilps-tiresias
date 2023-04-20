import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {findKey} from 'lodash-es';
import {InstitutionService} from '../../institutions/services/institution.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {
    Collection_collection,
    Collection_collection_institution,
    CollectionFilter,
    CollectionVisibility,
    UpdateCollection_updateCollection,
    UpdateCollection_updateCollection_institution,
    UserRole,
    Users_users_items,
} from '../../shared/generated-types';
import {collectionsHierarchicConfig} from '../../shared/hierarchic-configurations/CollectionConfiguration';
import {UserService} from '../../users/services/user.service';
import {CollectionService} from '../services/collection.service';
import {CollectionVisibilities} from '../../card/card.component';
import {DomainService} from '../../domains/services/domain.service';
import {HierarchicFiltersConfiguration} from '@ecodev/natural';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent extends AbstractDetailDirective<CollectionService> implements OnInit {
    public visibility: keyof CollectionVisibilities = 1;
    public visibilities: CollectionVisibilities = {
        1: {
            value: CollectionVisibility.private,
            text: 'par moi et les abonnés',
            color: 'warn',
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
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<CollectionFilter> = [];

    public showVisibility = true;

    public constructor(
        public readonly institutionService: InstitutionService,
        public readonly collectionService: CollectionService,
        userService: UserService,
        alertService: AlertService,
        dialogRef: MatDialogRef<CollectionComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Collection_collection},
    ) {
        super(collectionService, alertService, dialogRef, userService, data);
    }

    public updateVisibility(): void {
        this.data.item.visibility = this.visibilities[this.visibility].value;
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

    protected override postQuery(): void {
        // Init visibility
        this.visibility = +findKey(
            this.visibilities,
            s => s.value === this.data.item.visibility,
        ) as keyof CollectionVisibilities;

        this.institution = this.data.item.institution;

        this.showVisibility = this.computeShowVisibility();

        // Prevent parent choices that would form cyclic hierarchy
        if (this.data.item.id) {
            this.ancestorsHierarchicFilters = [
                {
                    service: DomainService,
                    filter: {
                        groups: [{conditions: [{custom: {excludeSelfAndDescendants: {value: this.data.item.id}}}]}],
                    },
                },
            ];
        }
    }

    protected override postUpdate(model: UpdateCollection_updateCollection): void {
        this.institution = model.institution;
    }
}
