import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {findKey} from 'lodash-es';
import {InstitutionService} from '../../institutions/services/institution.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {
    Collection,
    CollectionFilter,
    CollectionVisibility,
    UpdateCollection,
    UserRole,
    Users,
} from '../../shared/generated-types';
import {collectionsHierarchicConfig} from '../../shared/hierarchic-configurations/CollectionConfiguration';
import {UserService} from '../../users/services/user.service';
import {CollectionService} from '../services/collection.service';
import {CollectionVisibilities} from '../../card/card.component';
import {DomainService} from '../../domains/services/domain.service';
import {
    HierarchicFiltersConfiguration,
    NaturalRelationsComponent,
    NaturalSelectHierarchicComponent,
} from '@ecodev/natural';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ThesaurusComponent} from '../../shared/components/thesaurus/thesaurus.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import {NgIf} from '@angular/common';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatTabsModule,
        FlexModule,
        NgIf,
        MatSliderModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ThesaurusComponent,
        MatSlideToggleModule,
        NaturalRelationsComponent,
        DialogFooterComponent,
        NaturalSelectHierarchicComponent,
    ],
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

    public institution:
        | Collection['collection']['institution']
        | UpdateCollection['updateCollection']['institution']
        | null = null;

    public hierarchicConfig = collectionsHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<CollectionFilter> = [];

    public showVisibility = true;

    public constructor(
        public readonly institutionService: InstitutionService,
        public readonly collectionService: CollectionService,
        userService: UserService,
        alertService: AlertService,
        dialogRef: MatDialogRef<CollectionComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Collection['collection']},
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
        const isCreator = hasCreator && this.user.id === this.data.item!.creator!.id;
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

    public displayFn(item: Users['users']['items'][0] | string | null): string {
        return item && typeof item !== 'string' ? item.login : '';
    }

    protected override postQuery(): void {
        // Init visibility
        this.visibility = +findKey(
            this.visibilities,
            s => s.value === this.data.item.visibility,
        )! as keyof CollectionVisibilities;

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

    protected override postUpdate(model: UpdateCollection['updateCollection']): void {
        this.institution = model.institution;
    }
}
