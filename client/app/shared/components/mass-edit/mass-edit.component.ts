import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {Literal} from '@ecodev/natural';
import {CardService} from '../../../card/services/card.service';
import {CardInput, Site} from '../../generated-types';
import {TruncatePipe} from '../../pipes/truncate.pipe';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CardComponent} from '../../../card/card.component';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-mass-edit',
    templateUrl: './mass-edit.component.html',
    styleUrl: './mass-edit.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        CardComponent,
        MatCheckboxModule,
        FormsModule,
        MatButtonModule,
        TruncatePipe,
    ],
})
export class MassEditComponent {
    public readonly card: CardInput;
    public Site = Site;
    public step = 2;

    public createSuggestions = false;

    /**
     * Template exposed variable
     */
    public readonly CardService = CardService;

    public constructor(
        private readonly cardService: CardService,
        @Inject(MAT_DIALOG_DATA) public readonly data: Literal,
    ) {
        if (data?.changeable?.length || data?.unchangeable?.length) {
            this.step = 1;
        }

        const card = cardService.getDefaultForServer();
        card.visibility = null;
        card.precision = null;
        this.card = card;
    }
}
