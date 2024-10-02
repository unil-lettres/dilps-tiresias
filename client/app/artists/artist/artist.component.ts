import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {ArtistService} from '../services/artist.service';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    standalone: true,
    imports: [MatDialogModule, MatTabsModule, MatFormFieldModule, MatInputModule, FormsModule, DialogFooterComponent],
})
export class ArtistComponent extends AbstractDetailDirective<ArtistService, ThesaurusDetailDialogExtraData> {
    public constructor() {
        const service = inject(ArtistService);

        super(service);
    }
}
