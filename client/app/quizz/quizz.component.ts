import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {CardService} from '../card/services/card.service';
import {Card} from '../shared/generated-types';
import {Result, test} from './quizz.utils';
import {NaturalAbstractController} from '@ecodev/natural';
import {HideTooltipDirective} from '../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-quizz',
    templateUrl: './quizz.component.html',
    styleUrls: ['./quizz.component.scss'],
    standalone: true,
    imports: [
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        CommonModule,
        MatExpansionModule,
        MatTooltipModule,
        HideTooltipDirective,
    ],
})
export class QuizzComponent extends NaturalAbstractController implements OnInit, OnDestroy {
    public cards: string[] = [];
    public card: Card['card'] | null = null;
    public imageSrc: string | null = null;
    public currentIndex = 0;
    public attributes: Result = {
        name: false,
        artists: false,
        institution: false,
        dating: false,
    };
    public formCtrl: FormControl = new FormControl();
    private routeParamsSub: Subscription | null = null;
    private formChangeSub: Subscription | null = null;

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly cardService: CardService,
    ) {
        super();
    }

    public override ngOnDestroy(): void {
        this.routeParamsSub?.unsubscribe();
        this.formChangeSub?.unsubscribe();
    }

    public ngOnInit(): void {
        this.routeParamsSub = this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
            if (params.cards) {
                this.cards = params.cards.split(',');
                this.getCard(this.cards[0]);
            }
        });

        this.formChangeSub = this.formCtrl.valueChanges
            .pipe(takeUntil(this.ngUnsubscribe), debounceTime(500))
            .subscribe(val => {
                if (this.card) {
                    this.attributes = test(val, this.card);
                }
            });
    }

    public goToNext(): void {
        this.formCtrl.setValue('');
        const index = this.cards.findIndex(c => c === this.card?.id);
        this.getCard(this.cards[index + 1]);
    }

    public getArtistsNames(artists: Card['card']['artists']): string {
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
