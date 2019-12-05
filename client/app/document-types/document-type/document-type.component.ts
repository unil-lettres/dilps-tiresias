import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../shared/components/alert/alert.service';
import { UserService } from '../../users/services/user.service';
import { DocumentTypeService } from '../services/document-type.service';

@Component({
    selector: 'app-document-type',
    templateUrl: './document-type.component.html',
})
export class DocumentTypeComponent extends AbstractDetail {

    constructor(service: DocumentTypeService,
                alertService: AlertService,
                userService: UserService,
                dialogRef: MatDialogRef<DocumentTypeComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        super(service, alertService, dialogRef, userService, data);
    }
}
