import {Component, inject} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {CollectionService} from '../../collections/services/collection.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {UpdateUser, User, UserRole, UserType} from '../../shared/generated-types';
import {collectionsHierarchicConfig} from '../../shared/hierarchic-configurations/CollectionConfiguration';
import {UserService} from '../services/user.service';
import {IEnum, NaturalEnumService, NaturalRelationsComponent} from '@ecodev/natural';
import {TypePipe} from '../../shared/pipes/type.pipe';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ThesaurusComponent} from '../../shared/components/thesaurus/thesaurus.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
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
    templateUrl: './user.component.html',
    imports: [
        MatDialogModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        ThesaurusComponent,
        MatDatepickerModule,
        MatSelectModule,
        MatOptionModule,
        NaturalRelationsComponent,
        DialogFooterComponent,
        TypePipe,
    ],
})
export class UserComponent extends AbstractDetailDirective<UserService, {password?: string}> {
    public readonly institutionSortedByUsageService = inject(InstitutionSortedByUsageService);
    public readonly collectionService = inject(CollectionService);

    public collectionsHierarchicConfig = collectionsHierarchicConfig;
    public roles: IEnum[] = [];
    private userRolesAvailable: UserRole[] = [];

    public passwordGroupCtrl: FormGroup;
    public passwordCtrl: FormControl;
    public passwordConfirmationCtrl: FormControl;

    public institution: UpdateUser['updateUser']['institution'] | User['user']['institution'] | null = null;

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

    public isShibbolethUser(): boolean {
        return this.data.item.type === UserType.Aai;
    }

    protected override postQuery(): void {
        if (this.isUpdatePage()) {
            this.institution = this.data.item.institution;
        }

        this.userService.getUserRolesAvailable(this.isUpdatePage() ? this.data.item : null).subscribe(userRoles => {
            this.userRolesAvailable = userRoles;
        });
    }

    protected override postUpdate(model: UpdateUser['updateUser']): void {
        this.institution = model.institution;
    }

    public roleDisabled(role: string): boolean {
        return !this.userRolesAvailable.includes(role as UserRole);
    }
}
