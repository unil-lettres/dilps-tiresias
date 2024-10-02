import {Component, OnInit, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {CardService} from '../card/services/card.service';
import {Card} from '../shared/generated-types';
import {Result, test} from './quizz.utils';
import {HideTooltipDirective} from '../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-quizz',
    templateUrl: './quizz.component.html',
    styleUrl: './quizz.component.scss',
    standalone: true,
    imports: [
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
export class QuizzComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly cardService = inject(CardService);

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
    private routeParams$ = this.route.params.pipe(takeUntilDestroyed());
    private formChange$ = this.formCtrl.valueChanges.pipe(takeUntilDestroyed(), debounceTime(500));

    public ngOnInit(): void {
        this.routeParams$.subscribe(params => {
            if (params.cards) {
                this.cards = params.cards.split(',');
                this.getCard(this.cards[0]);
            }
        });

        this.formChange$.subscribe(val => {
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
