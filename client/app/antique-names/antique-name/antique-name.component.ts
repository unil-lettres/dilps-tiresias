import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {AntiqueNameService} from '../services/antique-name.service';
import {AntiqueName_antiqueName} from '../../shared/generated-types';

@Component({
    selector: 'app-antique-name',
    templateUrl: './antique-name.component.html',
})
export class AntiqueNameComponent extends AbstractDetailDirective<AntiqueNameService> {
    public constructor(
        service: AntiqueNameService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<AntiqueNameComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: AntiqueName_antiqueName},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }
}
