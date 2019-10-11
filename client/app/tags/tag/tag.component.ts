import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../shared/components/alert/alert.service';
import { UserService } from '../../users/services/user.service';
import { TagService } from '../services/tag.service';

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
})
export class TagComponent extends AbstractDetail {

    constructor(service: TagService,
                alertService: AlertService,
                userService: UserService,
                dialogRef: MatDialogRef<TagComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        super(service, alertService, dialogRef, userService, data);
    }
}
