import {Component, OnInit} from '@angular/core';
import {CardService} from '../../../card/services/card.service';

@Component({
    selector: 'app-card-selector',
    templateUrl: './card-selector.component.html',
    styleUrls: ['./card-selector.component.scss'],
})
export class CardSelectorComponent implements OnInit {
    public card;
    public image;

    constructor(public cardService: CardService) {}

    public ngOnInit(): void {}

    public displayWith(item): string {
        return item ? item.name + ' (' + item.id + ')' : '';
    }
}
