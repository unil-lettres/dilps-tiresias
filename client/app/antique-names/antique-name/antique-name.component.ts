import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AntiqueNameService} from '../services/antique-name.service';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-antique-name',
    templateUrl: './antique-name.component.html',
    imports: [MatDialogModule, MatTabsModule, MatFormFieldModule, MatInputModule, FormsModule, DialogFooterComponent],
})
export class AntiqueNameComponent extends AbstractDetailDirective<AntiqueNameService, ThesaurusDetailDialogExtraData> {
    public constructor() {
        super(inject(AntiqueNameService));
    }
}
