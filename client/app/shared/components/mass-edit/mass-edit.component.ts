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
    protected readonly data = inject<Literal>(MAT_DIALOG_DATA);

    protected readonly card: CardInput;
    protected readonly Site = Site;
    protected step = 2;

    protected createSuggestions = false;

    /**
     * Template exposed variable
     */
    protected readonly CardService = CardService;

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
