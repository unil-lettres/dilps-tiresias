import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {UniqueValidatorDirective} from '../../shared/directives/unique-validator.directive';
import {InstitutionService} from '../services/institution.service';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {AddressComponent} from '../../shared/components/address/address.component';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';

@Component({
    selector: 'app-institution',
    imports: [
        MatDialogModule,
        MatFormField,
        MatLabel,
        MatError,
        MatInput,
        FormsModule,
        AddressComponent,
        DialogFooterComponent,
        UniqueValidatorDirective,
    ],
    templateUrl: './institution.component.html',
})
export class InstitutionComponent extends AbstractDetailDirective<InstitutionService, ThesaurusDetailDialogExtraData> {
    public constructor() {
        super(inject(InstitutionService));
    }

    protected override getTitleDeleteMessage(): string {
        return `Supprimer l'institution « ${this.data.item.name} » ?`;
    }
}
