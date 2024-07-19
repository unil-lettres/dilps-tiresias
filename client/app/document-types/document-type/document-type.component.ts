import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {DocumentTypeService} from '../services/document-type.service';
import {DocumentTypes} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-document-type',
    templateUrl: './document-type.component.html',
    standalone: true,
    imports: [MatDialogModule, MatTabsModule, MatFormFieldModule, MatInputModule, FormsModule, DialogFooterComponent],
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
        data: undefined | {item: DocumentTypes['documentTypes']['items'][0] & ThesaurusDetailDialogExtraData},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }
}
