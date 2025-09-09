import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {UniqueValidatorDirective} from '../../shared/directives/unique-validator.directive';
import {ArtistService} from '../services/artist.service';

@Component({
    selector: 'app-artist',
    imports: [
        MatDialogModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        DialogFooterComponent,
        UniqueValidatorDirective,
    ],
    templateUrl: './artist.component.html',
})
export class ArtistComponent extends AbstractDetailDirective<ArtistService, ThesaurusDetailDialogExtraData> {
    public constructor() {
        super(inject(ArtistService));
    }
}
