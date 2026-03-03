import {Component, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';
import {MatButton} from '@angular/material/button';
import {
    HierarchicFiltersConfiguration,
    NaturalRelationsComponent,
    NaturalSelectHierarchicComponent,
    NaturalQueryVariablesManager,
    NaturalLinkMutationService,
} from '@ecodev/natural';
import {findKey} from 'es-toolkit';
import {CollectionVisibilities} from '../../card/card.component';
import {DomainService} from '../../domains/services/domain.service';
import {InstitutionSortedByUsageService} from '../../institutions/services/institutionSortedByUsage.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {ThesaurusComponent} from '../../shared/components/thesaurus/thesaurus.component';
import {
    CollectionQuery,
    CollectionFilter,
    CollectionVisibility,
    UpdateCollection,
    UserRole,
    UsersQuery,
} from '../../shared/generated-types';
import {collectionsHierarchicConfig} from '../../shared/hierarchic-configurations/CollectionConfiguration';
import {CollectionService} from '../services/collection.service';
import {MatIcon} from '@angular/material/icon';

@Component({
    selector: 'app-collection',
    imports: [
        MatDialogModule,
        MatSlider,
        MatSliderThumb,
        FormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        ThesaurusComponent,
        NaturalRelationsComponent,
        DialogFooterComponent,
        NaturalSelectHierarchicComponent,
        MatCheckbox,
        MatButton,
        MatIcon,
    ],
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.scss',
})
export class CollectionComponent extends AbstractDetailDirective<CollectionService> implements OnInit {
    protected readonly institutionSortedByUsageService = inject(InstitutionSortedByUsageService);
    private readonly linkService = inject(NaturalLinkMutationService);
    protected readonly UserRole = UserRole;

    protected readonly currentView = signal<'properties' | 'subscribers'>('properties');
    protected readonly subscribersCount = signal<number>(0);
    protected readonly isCurrentUserSubscribed = signal<boolean>(false);

    protected visibility: keyof CollectionVisibilities = 1;
    protected visibilities: CollectionVisibilities = {
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
        | CollectionQuery['collection']['institution']
        | UpdateCollection['updateCollection']['institution']
        | null = null;

    protected hierarchicConfig = collectionsHierarchicConfig;
    protected ancestorsHierarchicFilters: HierarchicFiltersConfiguration<CollectionFilter> = [];

    protected showVisibility = true;

    public constructor() {
        super(inject(CollectionService));
    }

    protected updateVisibility(): void {
        this.data.item.visibility = this.visibilities[this.visibility].value;
    }

    /**
     * Visibility is seen by >=seniors if they are the creator, or by admins if visibility is set to admin.
     */
    protected computeShowVisibility(): boolean {
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

    protected displayFn(item: UsersQuery['users']['items'][0] | string | null): string {
        return item && typeof item !== 'string' ? item.login : '';
    }

    protected override postQuery(): void {
        // Init visibility
        this.visibility = findKey(this.visibilities, s => s.value === this.data.item.visibility)!;

        if (this.isUpdatePage()) {
            this.institution = this.data.item.institution;
            this.loadSubscribersCount();
            this.checkIfCurrentUserIsSubscribed();
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

    private loadSubscribersCount(): void {
        const qvm = new NaturalQueryVariablesManager();
        qvm.set('variables', {
            filter: {
                groups: [{conditions: [{collections: {have: {values: [this.data.item.id]}}}]}],
            },
            pagination: {pageSize: 1, pageIndex: 0},
        });

        this.userService.getAll(qvm).subscribe(result => {
            this.subscribersCount.set(result.length);
        });
    }

    private checkIfCurrentUserIsSubscribed(): void {
        if (!this.user || !this.isUpdatePage()) {
            this.isCurrentUserSubscribed.set(false);
            return;
        }

        const qvm = new NaturalQueryVariablesManager();
        qvm.set('variables', {
            filter: {
                groups: [
                    {
                        conditions: [
                            {collections: {have: {values: [this.data.item.id]}}},
                            {id: {equal: {value: this.user.id}}},
                        ],
                    },
                ],
            },
            pagination: {pageSize: 1, pageIndex: 0},
        });

        this.userService.getAll(qvm).subscribe(result => {
            this.isCurrentUserSubscribed.set(result.length > 0);
        });
    }

    protected unsubscribeCurrentUser(): void {
        if (!this.user || !this.isCurrentUserSubscribed()) {
            return;
        }

        const title = 'Se désabonner de cette collection ?';
        const message = `Vous <strong>ne verrez plus</strong> cette collection si elle n'est pas publique et <strong>ne pourrez plus la modifier</strong>.<br><br>Vous ne pourrez pas vous réabonner vous-même.<br><br>Voulez-vous vraiment vous désabonner ?`;

        this.alertService.confirm(title, message, 'Me désabonner', undefined, 'warn', 'filled').subscribe(confirmed => {
            if (!confirmed) {
                return;
            }

            this.linkService.unlink(this.data.item as any, this.user as any).subscribe(() => {
                this.alertService.info('Vous avez été désabonné de cette collection');
                this.dialogRef.close();
            });
        });
    }

    protected showSubscribersView(): void {
        this.currentView.set('subscribers');
    }

    protected showPropertiesView(): void {
        this.currentView.set('properties');
        if (this.isUpdatePage()) {
            this.loadSubscribersCount();
            this.checkIfCurrentUserIsSubscribed();
        }
    }

    protected override getTitleDeleteMessage(): string {
        return `Supprimer la collection « ${this.data.item.name} » pour tout le monde ?`;
    }

    protected override getDeleteMessage(): string {
        return `Cette collection sera supprimée pour <strong>tous les utilisateurs</strong> et ne sera plus accessible.<br><br><strong>Cette action est irréversible.</strong><br><br>Les fiches qu'elle contient ne seront pas supprimées.`;
    }
}
