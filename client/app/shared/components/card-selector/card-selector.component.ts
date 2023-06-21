import {Component} from '@angular/core';
import {CardService} from '../../../card/services/card.service';
import {Cards} from '../../generated-types';

@Component({
    selector: 'app-card-selector',
    templateUrl: './card-selector.component.html',
    styleUrls: ['./card-selector.component.scss'],
})
export class CardSelectorComponent {
    public card: Cards['cards']['items'][0] | null = null;

    public constructor(public readonly cardService: CardService) {}

    public displayWith(item: Cards['cards']['items'][0] | string | null): string {
        return item && typeof item !== 'string' ? item.name + ' (' + item.id + ')' : '';
    }
}
