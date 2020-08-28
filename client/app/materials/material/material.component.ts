import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetail} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {materialHierarchicConfig} from '../../shared/hierarchic-configurations/MaterialConfiguration';
import {UserService} from '../../users/services/user.service';
import {MaterialService} from '../services/material.service';

@Component({
    selector: 'app-material',
    templateUrl: './material.component.html',
})
export class MaterialComponent extends AbstractDetail {
    public hierarchicConfig = materialHierarchicConfig;

    constructor(
        service: MaterialService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<MaterialComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
    ) {
        super(service, alertService, dialogRef, userService, data);
    }
}
