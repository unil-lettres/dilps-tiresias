import {Component, Inject} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {ArtistComponent} from '../../artists/artist/artist.component';
import {CollectionService} from '../../collections/services/collection.service';
import {InstitutionService} from '../../institutions/services/institution.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
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
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
    standalone: true,
    imports: [
        MatDialogModule,
        MatTabsModule,
        FlexModule,
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
    public collectionsHierarchicConfig = collectionsHierarchicConfig;
    public roles: IEnum[] = [];
    private userRolesAvailable: UserRole[] = [];

    public passwordGroupCtrl: FormGroup;
    public passwordCtrl: FormControl;
    public passwordConfirmationCtrl: FormControl;

    public institution: UpdateUser['updateUser']['institution'] | User['user']['institution'] | null = null;

    public constructor(
        public readonly institutionService: InstitutionService,
        service: UserService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<ArtistComponent>,
        public readonly collectionService: CollectionService,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: User['user']},
        naturalEnumService: NaturalEnumService,
    ) {
        super(service, alertService, dialogRef, userService, data);

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
        return this.data.item.type === UserType.aai;
    }

    protected override postQuery(): void {
        this.institution = this.data.item.institution;
        this.userService.getUserRolesAvailable(this.data.item).subscribe(userRoles => {
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
