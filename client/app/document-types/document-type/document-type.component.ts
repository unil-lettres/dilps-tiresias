import {Component, Inject} from '@angular/core';
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {DocumentTypeService} from '../services/document-type.service';
import {DocumentType_documentType} from '../../shared/generated-types';

@Component({
    selector: 'app-document-type',
    templateUrl: './document-type.component.html',
})
export class DocumentTypeComponent extends AbstractDetailDirective<DocumentTypeService> {
    public constructor(
        service: DocumentTypeService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<DocumentTypeComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: DocumentType_documentType},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }
}
