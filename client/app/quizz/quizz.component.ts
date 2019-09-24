import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { isString, uniq } from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { CardService } from '../card/services/card.service';
import { CardQuery } from '../shared/generated-types';

@Component({
    selector: 'app-quizz',
    templateUrl: './quizz.component.html',
    styleUrls: ['./quizz.component.scss'],
})
export class QuizzComponent implements OnInit, OnDestroy {

    public cards: string[] = [];
    public card: CardQuery['card'];
    public imageSrc;
    public currentIndex = 0;
    public attributes;
    public formCtrl: FormControl = new FormControl();
    private routeParamsSub;
    private formChangeSub;

    constructor(private route: ActivatedRoute,
                private cardSvc: CardService) {
    }

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
            this.test(val);
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
        this.cardSvc.getOne(id).subscribe((card: any) => {
            this.currentIndex = index;
            this.selectCard(card);
        });
    }

    private selectCard(card: CardQuery['card']) {
        this.card = card;
        this.imageSrc = CardService.getImageLink(card, 2000);
        this.attributes = {
            name: false,
            artists: false,
            institution: false,
            dating: false,
        };
    }

    private test(formValue: string): void {
        const commonPlaces = /(eglise|chapelle|musee)/g;
        const words = this.sanitize(formValue).replace(commonPlaces, '').split(/\W/).filter(word => word.length > 3);

        for (const attribute of Object.keys(this.attributes)) {
            const value = this.card[attribute];
            if (attribute === 'institution') {
                this.attributes[attribute] = this.testSingleThesaurus(words, value);
            } else if (attribute === 'artists') {
                this.attributes[attribute] = this.testMultipleThesaurus(words, value);
            } else if (attribute === 'dating') {
                this.attributes[attribute] = this.testDate(formValue, this.card.datings);
            } else if (isString(value)) {
                this.attributes[attribute] = this.testString(words, value);
            }
        }

    }

    private sanitize(string: string): string {
        return this.stripVowelAccent(string.toLowerCase());
    }

    private testString(words: string[], attributeValue: string): boolean {
        attributeValue = this.sanitize(attributeValue);
        for (const word of words) {
            if (attributeValue.indexOf(word) > -1) {
                return true;
            }
        }

        return false;
    }

    private testSingleThesaurus(words: string[], attributeValue): boolean {
        if (!attributeValue) {
            return false;
        }

        return this.testString(words, attributeValue.name);
    }

    private testMultipleThesaurus(words: string[], attributeValue): boolean {
        for (const item of attributeValue) {
            if (this.testSingleThesaurus(words, item)) {
                return true;
            }
        }

        return false;
    }

    private testDate(formValue: string, datings: CardQuery['card']['datings']) {

        const years: string[] = uniq(formValue.match(/(-?\d+)/));
        if (years) {
            for (const year of years) {
                const searched = (new Date(year)).getFullYear();
                for (const dating of datings) {
                    const from = (new Date(dating.from)).getFullYear();
                    const to = (new Date(dating.to)).getFullYear();

                    // If expected span is small, then allow a margin of error
                    const span = to - from;
                    let margin;
                    if (span === 0) {
                        margin = 25;
                    } else if (span < 20) {
                        margin = 15;
                    } else {
                        margin = 0;
                    }

                    if (searched >= from - margin && searched <= to + margin) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private stripVowelAccent(str) {

        const rExps = [
            {
                re: /[\xC0-\xC6]/g,
                ch: 'A',
            },
            {
                re: /[\xE0-\xE6]/g,
                ch: 'a',
            },
            {
                re: /[\xC8-\xCB]/g,
                ch: 'E',
            },
            {
                re: /[\xE8-\xEB]/g,
                ch: 'e',
            },
            {
                re: /[\xCC-\xCF]/g,
                ch: 'I',
            },
            {
                re: /[\xEC-\xEF]/g,
                ch: 'i',
            },
            {
                re: /[\xD2-\xD6]/g,
                ch: 'O',
            },
            {
                re: /[\xF2-\xF6]/g,
                ch: 'o',
            },
            {
                re: /[\xD9-\xDC]/g,
                ch: 'U',
            },
            {
                re: /[\xF9-\xFC]/g,
                ch: 'u',
            },
            {
                re: /[\xD1]/g,
                ch: 'N',
            },
            {
                re: /[\xF1]/g,
                ch: 'n',
            },
        ];

        for (let i = 0, len = rExps.length; i < len; i++) {
            str = str.replace(rExps[i].re, rExps[i].ch);
        }

        return str;
    }
}
