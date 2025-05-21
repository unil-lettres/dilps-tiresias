import {Component, inject, OnInit} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {findKey} from 'lodash-es';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {
    Collection,
    CollectionFilter,
    CollectionVisibility,
    UpdateCollection,
    UserRole,
    Users,
} from '../../shared/generated-types';
import {collectionsHierarchicConfig} from '../../shared/hierarchic-configurations/CollectionConfiguration';
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
import {MatTabsModule} from '@angular/material/tabs';
import {InstitutionSortedByUsageService} from '../../institutions/services/institutionSortedByUsage.service';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.scss',
    imports: [
        MatDialogModule,
        MatTabsModule,
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
    public readonly institutionSortedByUsageService = inject(InstitutionSortedByUsageService);
    public readonly UserRole = UserRole;

    public visibility: keyof CollectionVisibilities = 1;
    public visibilities: CollectionVisibilities = {
        1: {
            value: CollectionVisibility.Private,
            text: 'par moi et les abonnés',
            color: 'warn',
        },
        2: {
            value: CollectionVisibility.Administrator,
            text: 'par moi, les admins et les abonnés',
            color: 'accent',
        },
        3: {
            value: CollectionVisibility.Member,
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

    public constructor() {
        super(inject(CollectionService));
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

        const hasCreator = this.isUpdatePage() && !!this.data.item.creator;
        const isCreator = hasCreator && this.user.id === this.data.item.creator!.id;
        const isOwner = isCreator && [UserRole.senior, UserRole.administrator, UserRole.major].includes(this.user.role);

        if (isOwner) {
            return true;
        }

        const collectionIsNotPrivate =
            this.data.item.visibility === CollectionVisibility.Administrator ||
            this.data.item.visibility === CollectionVisibility.Member;

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

        if (this.isUpdatePage()) {
            this.institution = this.data.item.institution;
        }

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
