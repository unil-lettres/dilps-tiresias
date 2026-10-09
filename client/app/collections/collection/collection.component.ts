import {Component, computed, inject, type OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';
import {MatButton} from '@angular/material/button';
import {
    type HierarchicFiltersConfiguration,
    NaturalRelationsComponent,
    NaturalSelectHierarchicComponent,
} from '@ecodev/natural';
import {findKey} from 'es-toolkit';
import {type CollectionVisibilities} from '../../card/card.component';
import {InstitutionSortedByUsageService} from '../../institutions/services/institutionSortedByUsage.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {ThesaurusComponent} from '../../shared/components/thesaurus/thesaurus.component';
import {
    type CollectionQuery,
    type CollectionFilter,
    type CollectionFilterGroupConditionCustom,
    CollectionVisibility,
    type UpdateCollection,
    UserRole,
    type UsersQuery,
    type ViewerQuery,
} from '../../shared/generated-types';
import {collectionsHierarchicConfig} from '../../shared/hierarchic-configurations/CollectionConfiguration';
import {CollectionService} from '../services/collection.service';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {HintComponent} from '../../shared/components/hint/hint.component';

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
        MatDivider,
        HintComponent,
    ],
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class CollectionComponent
    extends AbstractDetailDirective<CollectionService, {initialView?: 'properties' | 'subscribers'}>
    implements OnInit
{
    protected readonly institutionSortedByUsageService = inject(InstitutionSortedByUsageService);
    protected readonly UserRole = UserRole;

    protected readonly currentView = signal<'properties' | 'subscribers'>('properties');
    protected readonly responsiblesCount = signal<number>(0);
    protected readonly plainSubscribersCount = signal<number>(0);
    protected readonly viewerIsResponsible = signal<boolean>(false);
    protected readonly viewerIsSubscriber = signal<boolean>(false);
    protected readonly canManageResponsibles = signal<boolean>(false);
    protected readonly canManageSubscribers = signal<boolean>(false);

    /**
     * Names of the parent collections that are not visible to all members. A collection is only visible if all its
     * parents are, so the people added to this collection must also be given access to those parents.
     */
    protected readonly restrictedParents = signal<string[]>([]);
    protected readonly restrictedParentsLabel = computed(() =>
        this.restrictedParents()
            .map(name => `« ${name} »`)
            .join(', '),
    );

    /**
     * A responsible is a subscriber with more rights, so the total number of subscribers includes the responsibles.
     */
    protected readonly subscribersCount = computed(() => this.responsiblesCount() + this.plainSubscribersCount());

    /**
     * `natural-relations` is read-only when `main.permissions.update` is false. But managing the subscribers/responsibles
     * of a collection is governed by `manageSubscribers`/`manageResponsibles`, not by `update` (which is owner-only).
     * So we expose the collection with a `permissions.update` reflecting the relevant right (the real ACL is enforced
     * server-side by the link/unlink mutations anyway).
     */
    protected readonly subscribersMain = computed(() => this.mainWithUpdatePermission(this.canManageSubscribers()));
    protected readonly responsiblesMain = computed(() => this.mainWithUpdatePermission(this.canManageResponsibles()));

    private mainWithUpdatePermission(update: boolean): CollectionQuery['collection'] {
        const item = this.data.item as CollectionQuery['collection'];

        return {...item, permissions: {...item.permissions, update}};
    }

    protected visibility: keyof CollectionVisibilities = 1;
    protected visibilities: CollectionVisibilities = {
        1: {
            value: CollectionVisibility.Private,
            text: 'par moi et les abonnés',
        },
        2: {
            value: CollectionVisibility.Administrator,
            text: 'par moi, les admins et les abonnés',
        },
        3: {
            value: CollectionVisibility.Member,
            text: 'par les membres',
        },
    };

    public institution:
        CollectionQuery['collection']['institution'] | UpdateCollection['updateCollection']['institution'] | null =
        null;

    protected hierarchicConfig = collectionsHierarchicConfig;
    protected parentHierarchicFilters: HierarchicFiltersConfiguration<CollectionFilter> = [];

    protected showVisibility = true;

    public constructor() {
        super(inject(CollectionService));
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.userService
            .getCurrentUser()
            .subscribe(user => (this.parentHierarchicFilters = this.getParentHierarchicFilters(user)));
    }

    /**
     * A collection can only be put inside a collection whose content the user manages (owner or responsible, as
     * enforced by the server), and never inside itself or its descendants, which would form a cyclic hierarchy.
     *
     * Like in the collection selector, administrators and majors are not filtered. This must be a single group of
     * conditions, because the hierarchic selector cannot merge groups of different logics.
     */
    private getParentHierarchicFilters(
        user: ViewerQuery['viewer'] | null,
    ): HierarchicFiltersConfiguration<CollectionFilter> {
        const custom: CollectionFilterGroupConditionCustom = {};
        if (this.data.item.id) {
            custom.excludeSelfAndDescendants = {value: this.data.item.id};
        }

        if (user && ![UserRole.administrator, UserRole.major].includes(user.role)) {
            custom.manageableByViewer = {value: true};
        }

        return [{service: CollectionService, filter: {groups: [{conditions: [{custom}]}]}}];
    }

    protected updateVisibility(): void {
        this.data.item.visibility = this.visibilities[this.visibility].value;
    }

    /**
     * Whether the current user is the owner (creator) of the collection.
     */
    protected isOwner(): boolean {
        return (
            !!this.user && this.isUpdatePage() && !!this.data.item.creator && this.data.item.creator.id === this.user.id
        );
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
            this.applyMembershipFromItem();
            this.restrictedParents.set(
                (this.data.item as CollectionQuery['collection']).parentHierarchy
                    .filter(parent => parent.visibility !== CollectionVisibility.Member)
                    .map(parent => parent.name),
            );

            // When opened directly on the subscribers management (eg: from a responsible's contextual menu)
            if (this.data.item.initialView === 'subscribers') {
                this.showSubscribersView();
            }
        }

        this.showVisibility = this.computeShowVisibility();
    }

    protected override postUpdate(model: UpdateCollection['updateCollection']): void {
        this.institution = model.institution;
    }

    /**
     * Copy the membership related fields returned by the collection query into the local signals.
     *
     * On the server side, responsibles and plain subscribers are two distinct relations ("responsibles" and
     * "subscribers"), but in the UI a responsible is presented as a subscriber with more rights.
     */
    private setMembershipSignals(item: CollectionQuery['collection']): void {
        this.responsiblesCount.set(item.responsiblesCount);
        this.plainSubscribersCount.set(item.subscribersCount);
        this.viewerIsResponsible.set(item.viewerIsResponsible);
        this.viewerIsSubscriber.set(item.viewerIsSubscriber);
        this.canManageResponsibles.set(item.canManageResponsibles);
        this.canManageSubscribers.set(item.canManageSubscribers);
    }

    private applyMembershipFromItem(): void {
        this.setMembershipSignals(this.data.item as CollectionQuery['collection']);
    }

    /**
     * Re-fetch the collection to refresh counts and membership after managing its subscribers.
     */
    private refreshMembership(): void {
        if (!this.isUpdatePage()) {
            return;
        }

        this.service.getOne(this.data.item.id).subscribe(item => this.setMembershipSignals(item));
    }

    protected unsubscribeCurrentUser(): void {
        if (!this.user || !this.isUpdatePage() || (!this.viewerIsResponsible() && !this.viewerIsSubscriber())) {
            return;
        }

        const title = 'Se désabonner de cette collection ?';
        const message = `Vous <strong>ne verrez plus</strong> cette collection si elle n'est pas publique et <strong>ne pourrez plus la modifier</strong>.<br><br>Seul un responsable de la collection pourra vous réabonner.<br><br>Voulez-vous vraiment vous désabonner ?`;

        this.alertService
            .confirm(title, message, 'Me désabonner', undefined, 'error', 'filled')
            .subscribe(confirmed => {
                if (!confirmed) {
                    return;
                }

                this.service.unsubscribe(this.data.item).subscribe(() => {
                    this.alertService.info('Vous avez été désabonné de cette collection');
                    this.dialogRef.close();
                });
            });
    }

    protected showSubscribersView(): void {
        this.currentView.set('subscribers');
    }

    protected showPropertiesView(): void {
        // When opened directly on the subscribers management, "Terminer" closes the dialog instead of revealing
        // the properties (which the user may not be allowed to edit)
        if (this.data.item.initialView === 'subscribers') {
            this.dialogRef.close();

            return;
        }

        this.currentView.set('properties');
        this.refreshMembership();
    }

    protected override getTitleDeleteMessage(): string {
        return `Supprimer la collection « ${this.data.item.name} » pour tout le monde ?`;
    }

    protected override getDeleteMessage(): string {
        return `Cette collection sera supprimée pour <strong>tous les utilisateurs</strong> et ne sera plus accessible.<br><br><strong>Cette action est irréversible.</strong><br><br>Les fiches qu'elle contient ne seront pas supprimées.`;
    }
}
