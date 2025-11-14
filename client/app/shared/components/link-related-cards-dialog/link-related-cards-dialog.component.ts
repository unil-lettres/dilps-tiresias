import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {Card} from '../../generated-types';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';

type Checkable = {checked: boolean};
type CheckablCard = Card['card']['cards'][0] & Checkable;
type CheckablCards = CheckablCard[];

export type LinkRelatedCardsDialogData = {
    cards: Card['card']['cards'];
    title: string;
    help: string;
};

export type LinkRelatedCardsDialogResult = Card['card']['cards'];

@Component({
    selector: 'app-link-related-cards-dialog',
    imports: [MatButton, MatDialogModule, MatCheckbox, FormsModule],
    templateUrl: './link-related-cards-dialog.component.html',
    styleUrl: './link-related-cards-dialog.component.scss',
})
export class LinkRelatedCardsDialogComponent {
    private readonly dialogRef = inject<MatDialogRef<LinkRelatedCardsDialogComponent>>(MatDialogRef);
    public readonly data = inject<LinkRelatedCardsDialogData>(MAT_DIALOG_DATA);

    public readonly cards: CheckablCards;
    public readonly title: string;
    public readonly help: string;

    public constructor() {
        const data = this.data;

        this.cards = data.cards.map(card => ({checked: true, ...card}));
        this.title = data.title;
        this.help = data.help;
    }

    protected filterCheckedCards(): CheckablCards {
        return this.cards.filter(card => card.checked);
    }
}
