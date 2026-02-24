import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {DocumentTypeService} from '../services/document-type.service';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Component({
    selector: 'app-document-type',
    imports: [
        MatDialogModule,
        MatTab,
        MatTabGroup,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        DialogFooterComponent,
    ],
    templateUrl: './document-type.component.html',
})
export class DocumentTypeComponent extends AbstractDetailDirective<
    DocumentTypeService,
    ThesaurusDetailDialogExtraData
> {
    public constructor() {
        super(inject(DocumentTypeService));
    }

    protected override getTitleDeleteMessage(): string {
        return `Supprimer le type de document « ${this.data.item.name} » ?`;
    }
}
