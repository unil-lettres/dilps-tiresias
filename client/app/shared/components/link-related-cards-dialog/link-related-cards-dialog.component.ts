import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {CardQuery} from '../../generated-types';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {FormsModule} from '@angular/forms';

export type LinkRelatedCardsDialogData = {
    cards: CardQuery['card']['cards'];
    title: string;
    help: string;
};

export type LinkRelatedCardsDialogResult = CardQuery['card']['cards'];

@Component({
    selector: 'app-link-related-cards-dialog',
    imports: [MatButton, MatDialogModule, MatSelectionList, MatListOption, FormsModule],
    templateUrl: './link-related-cards-dialog.component.html',
})
export class LinkRelatedCardsDialogComponent {
    protected readonly data = inject<LinkRelatedCardsDialogData>(MAT_DIALOG_DATA);

    protected readonly cards: CardQuery['card']['cards'];
    protected selectedCards: CardQuery['card']['cards'];
    protected readonly title: string;
    protected readonly help: string;

    public constructor() {
        const data = this.data;

        this.cards = data.cards;
        this.selectedCards = [...data.cards];
        this.title = data.title;
        this.help = data.help;
    }
}
