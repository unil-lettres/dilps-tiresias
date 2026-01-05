import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage} from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    input,
    OnChanges,
    OnDestroy,
    OnInit,
    signal,
    SimpleChanges,
    viewChild,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {NaturalIconDirective, NaturalQueryVariablesManager} from '@ecodev/natural';
import {CardService} from 'client/app/card/services/card.service';
import {CardQuery, CardsQuery, CardsQueryVariables, JoinType} from '../../generated-types';

@Component({
    selector: 'app-related-cards',
    imports: [RouterLink, MatTooltip, MatIcon, NaturalIconDirective, MatMiniFabButton, NgOptimizedImage],
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
})
export class RelatedCardsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    protected readonly cardService = inject(CardService);

    /**
     * Offset to scroll when clicking on the scroll buttons.
     */
    private static readonly SCROLL_OFFSET = 200;

    public readonly card = input.required<CardQuery['card']>();

    protected readonly slideshow = viewChild.required<ElementRef>('slideshow');

    protected readonly isReduced = signal<boolean>(localStorage.getItem('isRelatedCardsReduced') === 'true');

    protected readonly CardService = CardService;

    /**
     * Whether the scrollbar could not scroll left anymore.
     */
    protected scrollBarAtLeft = true;

    /**
     * Whether the scrollbar could not scroll right anymore.
     */
    protected scrollBarAtRight = false;

    /**
     * If the breakpoint is smaller or equal to XSmall.
     */
    protected breakpointXSmall = false;

    /**
     * Related cards of the given card input.
     */
    protected cards: CardsQuery['cards']['items'][0][] = [];

    /**
     * Whether the slideshow has a scrollbar (too much images for the viewport)
     * or not.
     */
    protected hasScrollbar = false;

    /**
     * Query variables for retrieve related cards.
     */
    private readonly cardsQueryVariables = new NaturalQueryVariablesManager<CardsQueryVariables>();

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
                                    conditions: [{id: {equal: {value: this.card().id}}}],
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
        });
    }

    public ngAfterViewInit(): void {
        this.resizeObserver.observe(this.slideshow().nativeElement);
    }

    public ngOnDestroy(): void {
        this.resizeObserver.disconnect();
    }

    protected scrollLeft(): void {
        this.slideshow().nativeElement.scrollLeft -= RelatedCardsComponent.SCROLL_OFFSET;
    }

    protected scrollRight(): void {
        this.slideshow().nativeElement.scrollLeft += RelatedCardsComponent.SCROLL_OFFSET;
    }

    /**
     * Update the state of the scroll buttons (left and right) according to the
     * current scroll position and the size of the slideshow.
     */
    protected updateButtonsState(): void {
        const slideshow = this.slideshow().nativeElement;

        this.scrollBarAtLeft = slideshow.scrollLeft == 0;
        this.scrollBarAtRight = slideshow.scrollWidth - slideshow.scrollLeft == slideshow.clientWidth;
        this.hasScrollbar = slideshow.scrollWidth > slideshow.clientWidth;
    }

    protected toggleReduce(): void {
        const newValue = !this.isReduced();
        this.isReduced.set(newValue);
        localStorage.setItem('isRelatedCardsReduced', newValue.toString());
    }
}
