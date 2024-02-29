import {Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NaturalIconDirective} from '@ecodev/natural';
import {Card} from '../../generated-types';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
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
    templateUrl: './link-related-cards-dialog.component.html',
    styleUrls: ['./link-related-cards-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, NaturalIconDirective, MatDialogModule, MatCheckboxModule, FormsModule],
})
export class LinkRelatedCardsDialogComponent {
    public readonly cards: CheckablCards;
    public readonly title: string;
    public readonly help: string;

    public constructor(
        private readonly dialogRef: MatDialogRef<LinkRelatedCardsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public readonly data: LinkRelatedCardsDialogData,
    ) {
        this.cards = data.cards.map(card => ({checked: true, ...card}));
        this.title = data.title;
        this.help = data.help;
    }

    public filterCheckedCards(): CheckablCards {
        return this.cards.filter(card => card.checked);
    }
}
