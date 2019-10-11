import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../shared/components/alert/alert.service';
import { UserService } from '../../users/services/user.service';
import { DomainService } from '../services/domain.service';

@Component({
    selector: 'app-domain',
    templateUrl: './domain.component.html',
})
export class DomainComponent extends AbstractDetail {

    constructor(service: DomainService,
                alertService: AlertService,
                userService: UserService,
                dialogRef: MatDialogRef<DomainComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        super(service, alertService, dialogRef, userService, data);
    }
}
