import {Component, Inject} from '@angular/core';
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {InstitutionService} from '../services/institution.service';
import {Institution_institution} from '../../shared/generated-types';

@Component({
    selector: 'app-institution',
    templateUrl: './institution.component.html',
})
export class InstitutionComponent extends AbstractDetailDirective<InstitutionService> {
    public constructor(
        service: InstitutionService,
        alertSvc: AlertService,
        userSvc: UserService,
        dialogRef: MatDialogRef<InstitutionComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Institution_institution},
    ) {
        super(service, alertSvc, dialogRef, userSvc, data);
    }
}
