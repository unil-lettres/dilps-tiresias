import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../shared/components/alert/alert.service';
import { UserService } from '../../users/services/user.service';
import { AntiqueNameService } from '../services/antique-name.service';

@Component({
    selector: 'app-antique-name',
    templateUrl: './antique-name.component.html',
})
export class AntiqueNameComponent extends AbstractDetail {

    constructor(service: AntiqueNameService,
                alertService: AlertService,
                userService: UserService,
                dialogRef: MatDialogRef<AntiqueNameComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        super(service, alertService, dialogRef, userService, data);
    }
}
