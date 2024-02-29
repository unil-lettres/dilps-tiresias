import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {InstitutionService} from '../services/institution.service';
import {Institution} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {AddressComponent} from '../../shared/components/address/address.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-institution',
    templateUrl: './institution.component.html',
    standalone: true,
    imports: [
        MatDialogModule,
        MatTabsModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        AddressComponent,
        DialogFooterComponent,
    ],
})
export class InstitutionComponent extends AbstractDetailDirective<InstitutionService, ThesaurusDetailDialogExtraData> {
    public constructor(
        service: InstitutionService,
        alertSvc: AlertService,
        userSvc: UserService,
        dialogRef: MatDialogRef<InstitutionComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Institution['institution'] & ThesaurusDetailDialogExtraData},
    ) {
        super(service, alertSvc, dialogRef, userSvc, data);
    }
}
