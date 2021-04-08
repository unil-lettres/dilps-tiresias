import {Component, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ArtistComponent} from '../../artists/artist/artist.component';
import {CollectionService} from '../../collections/services/collection.service';
import {InstitutionService} from '../../institutions/services/institution.service';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {
    UpdateUser_updateUser,
    UpdateUser_updateUser_institution,
    User_user_institution,
    UserRole,
    UserType,
} from '../../shared/generated-types';
import {collectionsHierarchicConfig} from '../../shared/hierarchic-configurations/CollectionConfiguration';
import {UserService} from '../services/user.service';
import {IEnum, NaturalEnumService} from '@ecodev/natural';

function matchPassword(ac: AbstractControl): ValidationErrors | null {
    const password = ac.get('password').value; // to get value in input tag
    const passwordConfirmation = ac.get('passwordConfirmation').value; // to get value in input tag

    if (password !== passwordConfirmation) {
        ac.get('passwordConfirmation').setErrors({password: true});
    }

    return null;
}

@Component({
    selector: 'app-profile',
    templateUrl: './user.component.html',
})
export class UserComponent extends AbstractDetailDirective<UserService> {
    public collectionsHierarchicConfig = collectionsHierarchicConfig;
    public roles: IEnum[] = [];
    private userRolesAvailable: UserRole[] = [];

    public passwordGroupCtrl: FormGroup;
    public passwordCtrl: FormControl;
    public passwordConfirmationCtrl: FormControl;

    public institution: UpdateUser_updateUser_institution | User_user_institution | null = null;

    constructor(
        public readonly institutionService: InstitutionService,
        service: UserService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<ArtistComponent>,
        public readonly collectionService: CollectionService,
        @Inject(MAT_DIALOG_DATA) data: any,
        naturalEnumService: NaturalEnumService,
    ) {
        super(service, alertService, dialogRef, userService, data);

        naturalEnumService.get('UserRole').subscribe(roles => (this.roles = roles));

        this.passwordCtrl = new FormControl('');
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

    protected postQuery(): void {
        this.institution = this.data.item.institution;
        this.userService.getUserRolesAvailable(this.data.item).subscribe(userRoles => {
            this.userRolesAvailable = userRoles;
        });
    }

    protected postUpdate(model: UpdateUser_updateUser): void {
        this.institution = model.institution;
    }

    public roleDisabled(role: string): boolean {
        return !this.userRolesAvailable.includes(role as UserRole);
    }
}
