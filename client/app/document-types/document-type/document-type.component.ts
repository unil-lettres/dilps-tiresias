import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {DocumentTypeService} from '../services/document-type.service';
import {DocumentType} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-document-type',
    templateUrl: './document-type.component.html',
    standalone: true,
    imports: [
        MatDialogModule,
        MatTabsModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        DialogFooterComponent,
    ],
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
