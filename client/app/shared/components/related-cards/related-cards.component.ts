import {Component, Input, OnInit} from '@angular/core';
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
export class RelatedCardsComponent implements OnInit {
    @Input({required: true})
    public card!: Card['card'];

    public readonly CardService = CardService;

    public cards$: Observable<Cards['cards']['items'][0][]> | null = null;

    public constructor(public readonly cardService: CardService) {}

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<CardsVariables>();

        qvm.set('search', {
            filter: {
                groups: [
                    {
                        conditions: [{cards: {have: {values: [this.card.id]}}}],
                    },
                ],
            },
        });

        this.cards$ = this.cardService.watchAll(qvm).pipe(map(result => result.items));
    }
}
