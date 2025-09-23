import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AntiqueNameService} from '../services/antique-name.service';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Component({
    selector: 'app-antique-name',
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
    templateUrl: './antique-name.component.html',
})
export class AntiqueNameComponent extends AbstractDetailDirective<AntiqueNameService, ThesaurusDetailDialogExtraData> {
    public constructor() {
        super(inject(AntiqueNameService));
    }
}
