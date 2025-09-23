import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {Literal} from '@ecodev/natural';
import {CardService} from '../../../card/services/card.service';
import {CardInput, Site} from '../../generated-types';
import {TruncatePipe} from '../../pipes/truncate.pipe';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {CardComponent} from '../../../card/card.component';
import {NgTemplateOutlet} from '@angular/common';

@Component({
    selector: 'app-mass-edit',
    imports: [NgTemplateOutlet, MatDialogModule, CardComponent, MatCheckbox, FormsModule, MatButton, TruncatePipe],
    templateUrl: './mass-edit.component.html',
    styleUrl: './mass-edit.component.scss',
})
export class MassEditComponent {
    private readonly cardService = inject(CardService);
    public readonly data = inject<Literal>(MAT_DIALOG_DATA);

    public readonly card: CardInput;
    public Site = Site;
    public step = 2;

    public createSuggestions = false;

    /**
     * Template exposed variable
     */
    public readonly CardService = CardService;

    public constructor() {
        const cardService = this.cardService;
        const data = this.data;

        if (data?.changeable?.length || data?.unchangeable?.length) {
            this.step = 1;
        }

        const card = cardService.getDefaultForServer();
        card.visibility = null;
        card.precision = null;
        this.card = card;
    }
}
