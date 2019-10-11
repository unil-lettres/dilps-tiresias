import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../shared/components/alert/alert.service';
import { UserService } from '../../users/services/user.service';
import { PeriodService } from '../services/period.service';

@Component({
    selector: 'app-period',
    templateUrl: './period.component.html',
})
export class PeriodComponent extends AbstractDetail {

    constructor(service: PeriodService,
                alertService: AlertService,
                userService: UserService,
                dialogRef: MatDialogRef<PeriodComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        super(service, alertService, dialogRef, userService, data);
    }
}
