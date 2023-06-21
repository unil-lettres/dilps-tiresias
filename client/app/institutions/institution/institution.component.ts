import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {InstitutionService} from '../services/institution.service';
import {Institution} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';

@Component({
    selector: 'app-institution',
    templateUrl: './institution.component.html',
})
export class InstitutionComponent extends AbstractDetailDirective<InstitutionService, ThesaurusDetailDialogExtraData> {
    public constructor(
        service: InstitutionService,
        alertSvc: AlertService,
        userSvc: UserService,
        dialogRef: MatDialogRef<InstitutionComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Institution['institution'] & ThesaurusDetailDialogExtraData},
    ) {
        super(service, alertSvc, dialogRef, userSvc, data);
    }
}
