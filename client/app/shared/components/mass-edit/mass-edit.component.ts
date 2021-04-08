import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Literal} from '@ecodev/natural';
import {CardService} from '../../../card/services/card.service';
import {CardInput, Site} from '../../generated-types';

@Component({
    selector: 'app-mass-edit',
    templateUrl: './mass-edit.component.html',
    styleUrls: ['./mass-edit.component.scss'],
})
export class MassEditComponent {
    public readonly card: CardInput;
    public Site = Site;
    public step = 2;

    public createSuggestions = false;

    constructor(private readonly cardService: CardService, @Inject(MAT_DIALOG_DATA) public data: Literal) {
        if (data?.changeable?.length || data?.unchangeable?.length) {
            this.step = 1;
        }

        const card = cardService.getDefaultForServer();
        card.visibility = null;
        this.card = card;
    }
}
