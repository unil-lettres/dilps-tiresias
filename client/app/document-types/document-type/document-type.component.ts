import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {DocumentTypeService} from '../services/document-type.service';
import {DocumentType} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';

@Component({
    selector: 'app-document-type',
    templateUrl: './document-type.component.html',
})
export class DocumentTypeComponent extends AbstractDetailDirective<
    DocumentTypeService,
    ThesaurusDetailDialogExtraData
> {
    public constructor(
        service: DocumentTypeService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<DocumentTypeComponent>,
        @Inject(MAT_DIALOG_DATA)
        data: undefined | {item: DocumentType['documentType'] & ThesaurusDetailDialogExtraData},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }
}
