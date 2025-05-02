import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    viewChild,
    output,
} from '@angular/core';
import {IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage} from '@angular/common';
import {CardService} from 'client/app/card/services/card.service';
import {RouterLink} from '@angular/router';
import {Card, Cards, CardsVariables, JoinType} from '../../generated-types';
import {NaturalIconDirective, NaturalQueryVariablesManager} from '@ecodev/natural';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
    selector: 'app-related-cards',
    templateUrl: './related-cards.component.html',
    styleUrl: './related-cards.component.scss',
    providers: [
        {
            provide: IMAGE_LOADER,
            useValue: (config: ImageLoaderConfig) => {
                return CardService.getImageLink(config.loaderParams?.card, Math.min(config?.width ?? 300, 300));
            },
        },
    ],
    imports: [RouterLink, MatTooltipModule, MatIconModule, NaturalIconDirective, MatButtonModule, NgOptimizedImage],
})
export class RelatedCardsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    public readonly cardService = inject(CardService);

    /**
     * Offset to scroll when clicking on the scroll buttons.
     */
    private static readonly SCROLL_OFFSET = 200;

    @Input({required: true})
    public card!: Card['card'];

    /**
     * Whether the slideshow is reduced or not.
     */
    @Input()
    public isReduced = false;

    public readonly slideshow = viewChild.required<ElementRef>('slideshow');

    public readonly reduced = output<boolean>();

    public readonly closed = output<boolean>();

    public readonly CardService = CardService;

    /**
     * Whether the scrollbar could not scroll left anymore.
     */
    public scrollBarAtLeft = true;

    /**
     * Whether the scrollbar could not scroll right anymore.
     */
    public scrollBarAtRight = false;

    /**
     * If the breakpoint is smaller or equal to XSmall.
     */
    public breakpointXSmall = false;

    /**
     * Related cards of the given card input.
     */
    public cards: Cards['cards']['items'][0][] = [];

    /**
     * Whether the slideshow has a scrollbar (too much images for the viewport)
     * or not.
     */
    public hasScrollbar = false;

    /**
     * Query variables for retrieve related cards.
     */
    private readonly cardsQueryVariables = new NaturalQueryVariablesManager<CardsVariables>();

    /**
     * Resize observer to update buttons (scroll left and right) state when the
     * component is resized.
     */
    private readonly resizeObserver = new ResizeObserver(() => this.updateButtonsState());

    private readonly cardService$ = this.cardService.watchAll(this.cardsQueryVariables).pipe(takeUntilDestroyed());

    public constructor() {
        const breakpointObserver = inject(BreakpointObserver);

        breakpointObserver
            .observe(Breakpoints.XSmall)
            .pipe(takeUntilDestroyed())
            .subscribe(result => {
                this.breakpointXSmall = result.matches;
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.card) {
            // Update the query variables to retrieve related cards of the new
            // card.
            this.cardsQueryVariables.set('search', {
                filter: {
                    groups: [
                        {
                            joins: {
                                cards: {
                                    type: JoinType.innerJoin,
                                    conditions: [{id: {equal: {value: this.card.id}}}],
                                },
                            },
                        },
                    ],
                },
            });
        }
    }

    public ngOnInit(): void {
        this.cardService$.subscribe(result => {
            this.cards = result.items;
            this.closed.emit(this.cards.length === 0);
        });
    }

    public ngAfterViewInit(): void {
        this.resizeObserver.observe(this.slideshow().nativeElement);
    }

    public ngOnDestroy(): void {
        this.resizeObserver.disconnect();
    }

    public scrollLeft(): void {
        this.slideshow().nativeElement.scrollLeft -= RelatedCardsComponent.SCROLL_OFFSET;
    }

    public scrollRight(): void {
        this.slideshow().nativeElement.scrollLeft += RelatedCardsComponent.SCROLL_OFFSET;
    }

    /**
     * Update the state of the scroll buttons (left and right) according to the
     * current scroll position and the size of the slideshow.
     */
    public updateButtonsState(): void {
        const slideshow = this.slideshow().nativeElement;

        this.scrollBarAtLeft = slideshow.scrollLeft == 0;
        this.scrollBarAtRight = slideshow.scrollWidth - slideshow.scrollLeft == slideshow.clientWidth;
        this.hasScrollbar = slideshow.scrollWidth > slideshow.clientWidth;
    }

    public reduce(isReduced: boolean): void {
        this.reduced.emit(isReduced);
    }
}
