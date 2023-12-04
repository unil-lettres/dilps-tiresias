import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardService} from 'client/app/card/services/card.service';
import {RouterLink} from '@angular/router';
import {Card, Cards, CardsVariables} from '../../generated-types';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {Observable, map} from 'rxjs';

@Component({
    selector: 'app-related-cards',
    templateUrl: './related-cards.component.html',
    styleUrls: ['./related-cards.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterLink],
})
export class RelatedCardsComponent implements OnInit, OnChanges {
    @Input({required: true})
    public card!: Card['card'];

    public readonly CardService = CardService;

    public cards$: Observable<Cards['cards']['items'][0][]> | null = null;

    private cardsQueryVariables = new NaturalQueryVariablesManager<CardsVariables>();

    public constructor(public readonly cardService: CardService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.card) {
            this.updateCardsQueryVariables();
        }
    }

    public ngOnInit(): void {
        this.updateCardsQueryVariables();

        this.cards$ = this.cardService.watchAll(this.cardsQueryVariables).pipe(map(result => result.items));
    }

    private updateCardsQueryVariables(): void {
        this.cardsQueryVariables.set('search', {
            filter: {
                groups: [
                    {
                        conditions: [{cards: {have: {values: [this.card.id]}}}],
                    },
                ],
            },
        });
    }
}
