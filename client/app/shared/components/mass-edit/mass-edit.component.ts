import {Component} from '@angular/core';
import {CardService} from '../../../card/services/card.service';
import {CardInput} from '../../generated-types';

@Component({
    selector: 'app-mass-edit',
    templateUrl: './mass-edit.component.html',
    styleUrls: ['./mass-edit.component.scss'],
})
export class MassEditComponent {
    public readonly card: CardInput;

    constructor(private cardService: CardService) {
        const card = cardService.getDefaultForServer();
        card.visibility = null;
        this.card = card;
    }
}
