import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardService} from 'client/app/card/services/card.service';
import {RouterLink} from '@angular/router';
import {Card, Cards, CardsVariables} from '../../generated-types';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {Observable, map} from 'rxjs';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
    selector: 'app-related-cards',
    templateUrl: './related-cards.component.html',
    styleUrls: ['./related-cards.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterLink, MatTooltipModule],
})
export class RelatedCardsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input({required: true})
    public card!: Card['card'];

    @ViewChild('slideshow')
    public slideshow!: ElementRef;

    public readonly CardService = CardService;

    /**
     * Observable of cards related to the current card.
     */
    public cards$: Observable<Cards['cards']['items'][0][]> | null = null;

    /**
     * Whether the scroll left button should be disabled.
     */
    public disabledLeftButton = true;

    /**
     * Whether the scroll right button should be disabled.
     */
    public disabledRightButton = false;

    /**
     * Whether the scroll buttons should be hidden (if there is no scrollbar).
     */
    public hiddenButtons = false;

    /**
     * Query variables for retrieve related cards.
     */
    private readonly cardsQueryVariables = new NaturalQueryVariablesManager<CardsVariables>();

    /**
     * Resize observer to update buttons (scroll left and right) state when the
     * component is resized.
     */
    private readonly resizeObserver = new ResizeObserver(() => this.updateButtonsState());

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

    public ngAfterViewInit(): void {
        this.resizeObserver.observe(this.slideshow.nativeElement);
    }

    public ngOnDestroy(): void {
        this.resizeObserver.disconnect();
    }

    public scrollLeft(): void {
        this.slideshow.nativeElement.scrollLeft -= 100;
    }

    public scrollRight(): void {
        this.slideshow.nativeElement.scrollLeft += 100;
    }

    /**
     * Update the state of the scroll buttons (left and right) according to the
     * current scroll position and the size of the slideshow.
     */
    public updateButtonsState(): void {
        const slideshow = this.slideshow.nativeElement;

        this.disabledLeftButton = slideshow.scrollLeft == 0;
        this.disabledRightButton = slideshow.scrollWidth - slideshow.scrollLeft == slideshow.clientWidth;
        this.hiddenButtons = slideshow.scrollWidth <= slideshow.clientWidth;
    }

    /**
     * Called when the input card is changed to update the corresponding
     * query variable with the new card id..
     */
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
