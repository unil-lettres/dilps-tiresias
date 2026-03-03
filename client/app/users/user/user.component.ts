import {IEnum, NaturalEnumService, NaturalRelationsComponent, NaturalQueryVariablesManager} from '@ecodev/natural';
import {Component, inject, viewChild, signal} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormsModule,
    NgModel,
    ReactiveFormsModule,
    ValidationErrors,
} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {CollectionService} from '../../collections/services/collection.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {UniqueValidatorDirective} from '../../shared/directives/unique-validator.directive';
import {UpdateUser, UserQuery, UserRole, UserType} from '../../shared/generated-types';
import {collectionsHierarchicConfig} from '../../shared/hierarchic-configurations/CollectionConfiguration';
import {UserService} from '../services/user.service';
import {TypePipe} from '../../shared/pipes/type.pipe';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {ThesaurusComponent} from '../../shared/components/thesaurus/thesaurus.component';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
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
        MatFormField,
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
        NaturalRelationsComponent,
        DialogFooterComponent,
        TypePipe,
        UniqueValidatorDirective,
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class UserComponent extends AbstractDetailDirective<UserService, {password?: string}> {
    protected readonly emailRef = viewChild<NgModel>('email');
    protected readonly institutionSortedByUsageService = inject(InstitutionSortedByUsageService);
    protected readonly collectionService = inject(CollectionService);

    protected readonly currentView = signal<'properties' | 'collections'>('properties');
    protected readonly collectionsCount = signal<number>(0);

    protected readonly collectionsHierarchicConfig = collectionsHierarchicConfig;
    protected roles: IEnum[] = [];
    private userRolesAvailable: UserRole[] = [];

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

    protected override postQuery(): void {
        if (this.isUpdatePage()) {
            this.institution = this.data.item.institution;
            this.loadCollectionsCount();
        }

        this.userService.getUserRolesAvailable(this.isUpdatePage() ? this.data.item : null).subscribe(userRoles => {
            this.userRolesAvailable = userRoles;
        });
    }

    protected override postUpdate(model: UpdateUser['updateUser']): void {
        this.institution = model.institution;
    }

    protected roleDisabled(role: string): boolean {
        return !this.userRolesAvailable.includes(role as UserRole);
    }

    protected showCollectionsView(): void {
        this.currentView.set('collections');
    }

    protected showPropertiesView(): void {
        this.currentView.set('properties');
        if (this.isUpdatePage()) {
            this.loadCollectionsCount();
        }
    }

    private loadCollectionsCount(): void {
        const qvm = new NaturalQueryVariablesManager();
        qvm.set('variables', {
            filter: {
                groups: [{conditions: [{users: {have: {values: [this.data.item.id]}}}]}],
            },
            pagination: {pageSize: 1, pageIndex: 0},
        });

        this.collectionService.getAll(qvm).subscribe(result => {
            this.collectionsCount.set(result.length);
        });
    }

    protected override getTitleDeleteMessage(): string {
        return `Supprimer l'utilisateur « ${this.data.item.login} » ?`;
    }
}
