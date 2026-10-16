import {
    type IEnum,
    type LinkableObject,
    NaturalEnumService,
    NaturalQueryVariablesManager,
    NaturalLinkMutationService,
} from '@ecodev/natural';
import {forkJoin} from 'rxjs';
import {Component, inject, viewChild, signal, ChangeDetectionStrategy} from '@angular/core';
import {
    type AbstractControl,
    FormControl,
    FormGroup,
    FormsModule,
    type NgModel,
    ReactiveFormsModule,
    type ValidationErrors,
} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {CollectionService} from '../../collections/services/collection.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {UniqueValidatorDirective} from '../../shared/directives/unique-validator.directive';
import {
    type UpdateUser,
    type UserQuery,
    UserRole,
    UserType,
    type CollectionsQuery,
    LogicalOperator,
} from '../../shared/generated-types';
import {UserService} from '../services/user.service';
import {TypePipe} from '../../shared/pipes/type.pipe';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {HintComponent} from '../../shared/components/hint/hint.component';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {ThesaurusComponent} from '../../shared/components/thesaurus/thesaurus.component';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem, MatListItemTitle, MatDivider} from '@angular/material/list';
import {MatTooltip} from '@angular/material/tooltip';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {InstitutionSortedByUsageService} from '../../institutions/services/institutionSortedByUsage.service';

function matchPassword(ac: AbstractControl): ValidationErrors | null {
    const password = ac.get('password')!.value; // to get value in input tag
    const passwordConfirmation = ac.get('passwordConfirmation')!.value; // to get value in input tag

    if (password !== passwordConfirmation) {
        ac.get('passwordConfirmation')!.setErrors({password: true});
    }

    return null;
}

@Component({
    selector: 'app-profile',
    imports: [
        MatDialogModule,
        MatButton,
        MatIconButton,
        MatIcon,
        MatList,
        MatListItem,
        MatListItemTitle,
        MatTooltip,
        MatFormField,
        MatHint,
        MatLabel,
        MatError,
        MatSuffix,
        MatInput,
        FormsModule,
        ReactiveFormsModule,
        ThesaurusComponent,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSelect,
        MatOption,
        DialogFooterComponent,
        TypePipe,
        UniqueValidatorDirective,
        MatDivider,
        HintComponent,
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class UserComponent extends AbstractDetailDirective<
    UserService,
    {password?: string; isSelf?: boolean; initialView?: 'properties' | 'collections'}
> {
    protected readonly institutionSortedByUsageService = inject(InstitutionSortedByUsageService);
    protected readonly collectionService = inject(CollectionService);
    private readonly linkService = inject(NaturalLinkMutationService);

    protected readonly emailRef = viewChild<NgModel>('email');
    protected readonly currentView = signal<'properties' | 'collections'>('properties');
    protected readonly collectionsCount = signal<number>(0);
    protected readonly collections = signal<CollectionsQuery['collections']['items']>([]);

    /**
     * Among `collections`, the ones of which the user is a responsible, rather than a subscriber
     */
    private readonly responsibleCollectionIds = signal<ReadonlySet<string>>(new Set());
    protected isSelf = false;

    protected roles: IEnum[] = [];
    private userRolesAvailable: UserRole[] = [];

    /**
     * What each role allows, shown to whoever chooses the role
     */
    protected readonly roleDescriptions: Record<UserRole, string> = {
        [UserRole.student]:
            "Consulte les fiches visibles par les membres, ainsi que toutes les fiches des collections dont ce compte est lecteur·rice ou responsable, et suggère des modifications de leurs informations, qu'un·e administrateur·rice valide. Crée des collections, privées ou visibles par les admins, y ajoute ou en retire des fiches existantes, et y invite des lecteur·rices et des responsables. Ne peut pas ajouter d'images.",
        [UserRole.junior]:
            "Comme étudiant·e, et en plus : ajoute des images, que seul·e un·e administrateur·rice rend visibles à tou·tes les membres. Modifie les informations de ses propres fiches et les supprime, de même pour toute fiche contenue dans une collection publique dont ce compte est propriétaire ou responsable. Attention : ce compte peut ajouter n'importe quelle fiche à une telle collection pour obtenir le droit d'en modifier les informations, ou de la supprimer.",
        [UserRole.senior]:
            "Comme junior, et en plus : modifie les informations et supprime toute fiche contenue dans une collection dont ce compte est propriétaire ou responsable, même si elle n'est pas publique. Peut rendre ses collections publiques. Attention : ce compte peut donc créer une collection, y ajouter toutes les fiches qu'il voit, puis en modifier les informations ou les supprimer.",
        [UserRole.major]:
            'Comme senior, et en plus : ajoute des images à toute collection publique ou visible par les admins, et modifie le champ « Référence » des fiches.',
        [UserRole.administrator]:
            "Tous les droits : rend les fiches visibles, valide les suggestions, gère les comptes, les thésaurus, les actualités et les statistiques, et toutes les collections, sauf les collections privées des autres, où ce compte n'a que les droits qu'on lui donne.",
    };

    protected passwordGroupCtrl: FormGroup;
    protected passwordCtrl: FormControl;
    protected passwordConfirmationCtrl: FormControl;

    protected institution: UpdateUser['updateUser']['institution'] | UserQuery['user']['institution'] | null = null;

    public constructor() {
        super(inject(UserService));

        const naturalEnumService = inject(NaturalEnumService);
        naturalEnumService.get('UserRole').subscribe(roles => (this.roles = roles));

        this.passwordCtrl = new FormControl('');
        this.passwordCtrl.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => (this.data.item.password = this.passwordCtrl.value));

        this.passwordConfirmationCtrl = new FormControl('');
        this.passwordGroupCtrl = new FormGroup(
            {
                password: this.passwordCtrl,
                passwordConfirmation: this.passwordConfirmationCtrl,
            },
            {
                updateOn: 'change',
                validators: [matchPassword],
            },
        );
    }

    protected isShibbolethUser(): boolean {
        return this.data.item.type === UserType.Aai;
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.isSelf = !!this.data.item.isSelf;
    }

    protected override postQuery(): void {
        if (this.isUpdatePage()) {
            this.institution = this.data.item.institution;
            if (this.data.item.initialView === 'collections') {
                this.showCollectionsView();
            } else {
                this.loadCollectionsCount();
            }
        }

        this.userService.getUserRolesAvailable(this.isUpdatePage() ? this.data.item : null).subscribe(userRoles => {
            this.userRolesAvailable = userRoles;
        });
    }

    protected override postUpdate(model: UpdateUser['updateUser']): void {
        this.institution = model.institution;

        if (this.isSelf) {
            this.userService.refreshViewer();
        }
    }

    protected roleDisabled(role: string): boolean {
        return !this.userRolesAvailable.includes(role as UserRole);
    }

    /**
     * Whether the viewer may choose the role, and so is explained what the chosen role allows
     */
    protected canChangeRole(): boolean {
        return !this.isSelf && this.userRolesAvailable.length > 1;
    }

    protected showCollectionsView(): void {
        this.currentView.set('collections');
        this.loadCollections();
    }

    protected showPropertiesView(): void {
        if (this.data.item.initialView === 'collections') {
            this.dialogRef.close();
            return;
        }
        this.currentView.set('properties');
        if (this.isUpdatePage()) {
            this.loadCollectionsCount();
        }
    }

    /**
     * Filter matching the collections the user is a member of, either as a responsible or as a subscriber.
     */
    private membershipFilter(): {groups: unknown[]} {
        return {
            groups: [
                {conditions: [{responsibles: {have: {values: [this.data.item.id]}}}]},
                {
                    groupLogic: LogicalOperator.OR,
                    conditions: [{subscribers: {have: {values: [this.data.item.id]}}}],
                },
            ],
        };
    }

    private loadCollectionsCount(): void {
        const qvm = new NaturalQueryVariablesManager();
        qvm.set('variables', {
            filter: this.membershipFilter(),
            pagination: {pageSize: 1, pageIndex: 0},
        });

        this.collectionService.getAll(qvm).subscribe(result => {
            this.collectionsCount.set(result.length);
        });
    }

    private loadCollections(): void {
        const qvm = new NaturalQueryVariablesManager();
        qvm.set('variables', {
            filter: this.membershipFilter(),
        });

        const responsibleQvm = new NaturalQueryVariablesManager();
        responsibleQvm.set('variables', {
            filter: {groups: [{conditions: [{responsibles: {have: {values: [this.data.item.id]}}}]}]},
        });

        forkJoin([this.collectionService.getAll(qvm), this.collectionService.getAll(responsibleQvm)]).subscribe(
            ([result, responsibleResult]) => {
                this.responsibleCollectionIds.set(new Set(responsibleResult.items.map(collection => collection.id)));
                this.collections.set(result.items);
            },
        );
    }

    /**
     * Whether the user may be removed from the collection: anybody may leave on their own, but removing somebody else
     * requires the privilege of the relation they belong to
     */
    protected canRemoveFrom(collection: CollectionsQuery['collections']['items'][0]): boolean {
        if (this.isSelf) {
            return true;
        }

        return this.responsibleCollectionIds().has(collection.id)
            ? collection.canManageResponsibles
            : collection.canManageSubscribers;
    }

    protected unsubscribeFromCollection(collection: CollectionsQuery['collections']['items'][0]): void {
        const reload = (): void => {
            this.loadCollections();
            this.loadCollectionsCount();
        };

        // When leaving on our own behalf, use the dedicated mutation that requires no privilege on the collection
        if (this.isSelf) {
            this.collectionService.confirmAndUnsubscribe(collection).subscribe(reload);

            return;
        }

        const title = `Désabonner l'utilisateur de la collection « ${collection.name} » ?`;
        const message = `L'utilisateur·rice <strong>ne verra plus</strong> cette collection si elle n'est pas publique et <strong>ne pourra plus la modifier</strong>.<br><br>Le réabonnement devra être effectué par un·e responsable de la collection.<br><br>Confirmer le désabonnement ?`;

        this.alertService.confirm(title, message, 'Désabonner', undefined, 'error', 'filled').subscribe(confirmed => {
            if (!confirmed) {
                return;
            }

            // When an administrator removes someone else, unlink them from the only relation they belong to
            this.linkService
                .unlink(
                    collection,
                    this.data.item as LinkableObject,
                    this.responsibleCollectionIds().has(collection.id) ? 'responsible' : 'subscriber',
                )
                .subscribe(() => {
                    this.alertService.info(`Désabonnement de la collection « ${collection.name} » effectué`);
                    reload();
                });
        });
    }

    protected override getTitleDeleteMessage(): string {
        return `Supprimer l'utilisateur « ${this.data.item.login} » ?`;
    }
}
