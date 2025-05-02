import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {InstitutionService} from '../services/institution.service';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {AddressComponent} from '../../shared/components/address/address.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-institution',
    templateUrl: './institution.component.html',
    imports: [
        MatDialogModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        AddressComponent,
        DialogFooterComponent,
    ],
})
export class InstitutionComponent extends AbstractDetailDirective<InstitutionService, ThesaurusDetailDialogExtraData> {
    public constructor() {
        super(inject(InstitutionService));
    }
}
