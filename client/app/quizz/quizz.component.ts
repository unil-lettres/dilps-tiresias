import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {CardService} from '../card/services/card.service';
import {Card} from '../shared/generated-types';
import {Result, test} from './quizz.utils';

@Component({
    selector: 'app-quizz',
    templateUrl: './quizz.component.html',
    styleUrls: ['./quizz.component.scss'],
})
export class QuizzComponent implements OnInit, OnDestroy {
    public cards: string[] = [];
    public card: Card['card'];
    public imageSrc;
    public currentIndex = 0;
    public attributes: Result;
    public formCtrl: FormControl = new FormControl();
    private routeParamsSub;
    private formChangeSub;

    constructor(private route: ActivatedRoute, private cardService: CardService) {}

    ngOnDestroy() {
        this.routeParamsSub.unsubscribe();
        this.formChangeSub.unsubscribe();
    }

    ngOnInit() {
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

    public goToNext() {
        this.formCtrl.setValue('');
        const index = this.cards.findIndex(c => c === this.card.id);
        this.getCard(this.cards[index + 1]);
    }

    public getArtistsNames(artists) {
        return artists.map(a => a.name).join(', ');
    }

    private getCard(id: string) {
        if (!id) {
            return;
        }

        const index = this.cards.findIndex(c => c === id);
        this.cardService.getOne(id).subscribe((card: any) => {
            this.currentIndex = index;
            this.selectCard(card);
        });
    }

    private selectCard(card: Card['card']) {
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
