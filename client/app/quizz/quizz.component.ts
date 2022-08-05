import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {CardService} from '../card/services/card.service';
import {Card, Card_card_artists} from '../shared/generated-types';
import {Result, test} from './quizz.utils';

@Component({
    selector: 'app-quizz',
    templateUrl: './quizz.component.html',
    styleUrls: ['./quizz.component.scss'],
})
export class QuizzComponent implements OnInit, OnDestroy {
    public cards: string[] = [];
    public card: Card['card'];
    public imageSrc = '';
    public currentIndex = 0;
    public attributes: Result;
    public formCtrl: UntypedFormControl = new UntypedFormControl();
    private routeParamsSub: Subscription | null = null;
    private formChangeSub: Subscription | null = null;

    public constructor(private readonly route: ActivatedRoute, private readonly cardService: CardService) {}

    public ngOnDestroy(): void {
        this.routeParamsSub.unsubscribe();
        this.formChangeSub.unsubscribe();
    }

    public ngOnInit(): void {
        this.routeParamsSub = this.route.params.subscribe(params => {
            if (params.cards) {
                this.cards = params.cards.split(',');
                this.getCard(this.cards[0]);
            }
        });

        this.formChangeSub = this.formCtrl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
            this.attributes = test(val, this.card);
        });
    }

    public goToNext(): void {
        this.formCtrl.setValue('');
        const index = this.cards.findIndex(c => c === this.card.id);
        this.getCard(this.cards[index + 1]);
    }

    public getArtistsNames(artists: Card_card_artists[]): string {
        return artists.map(a => a.name).join(', ');
    }

    private getCard(id: string): void {
        if (!id) {
            return;
        }

        const index = this.cards.findIndex(c => c === id);
        this.cardService.getOne(id).subscribe((card: any) => {
            this.currentIndex = index;
            this.selectCard(card);
        });
    }

    private selectCard(card: Card['card']): void {
        this.card = card;
        this.imageSrc = CardService.getImageLink(card, 2000);
        this.attributes = {
            name: false,
            artists: false,
            institution: false,
            dating: false,
        };
    }
}
