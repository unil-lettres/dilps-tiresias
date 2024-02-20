import {
    AfterViewInit,
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    inject,
} from '@angular/core';
import {CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage} from '@angular/common';
import {CardService} from 'client/app/card/services/card.service';
import {RouterLink} from '@angular/router';
import {Card, Cards, CardsVariables} from '../../generated-types';
import {NaturalIconDirective, NaturalQueryVariablesManager} from '@ecodev/natural';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
    selector: 'app-related-cards',
    templateUrl: './related-cards.component.html',
    styleUrls: ['./related-cards.component.scss'],
    standalone: true,
    providers: [
        {
            provide: IMAGE_LOADER,
            useValue: (config: ImageLoaderConfig) => {
                return CardService.getImageLink(config.loaderParams?.card, Math.min(config?.width ?? 200, 200));
            },
        },
    ],
    imports: [
        CommonModule,
        RouterLink,
        MatTooltipModule,
        MatIconModule,
        NaturalIconDirective,
        MatButtonModule,
        NgOptimizedImage,
    ],
})
export class RelatedCardsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    /**
     * Offset to scroll when clicking on the scroll buttons.
     */
    private static readonly SCROLL_OFFSET = 200;

    private readonly destroyRef = inject(DestroyRef);

    @Input({required: true})
    public card!: Card['card'];

    /**
     * Whether the slideshow is reduced or not.
     */
    @Input()
    public isReduced = false;

    @ViewChild('slideshow')
    public slideshow!: ElementRef;

    @Output()
    public reduced = new EventEmitter<boolean>();

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

    public constructor(
        public readonly cardService: CardService,
        breakpointObserver: BreakpointObserver,
    ) {
        breakpointObserver
            .observe(Breakpoints.XSmall)
            .pipe(takeUntilDestroyed())
            .subscribe(result => {
                this.breakpointXSmall = result.matches;
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.card) {
            this.updateCardsQueryVariables();
        }
    }

    public ngOnInit(): void {
        this.updateCardsQueryVariables();
        this.cardService
            .watchAll(this.cardsQueryVariables)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(result => {
                this.cards = result.items;
                this.reduced.emit(this.cards.length === 0);
            });
    }

    public ngAfterViewInit(): void {
        this.resizeObserver.observe(this.slideshow.nativeElement);
    }

    public ngOnDestroy(): void {
        this.resizeObserver.disconnect();
    }

    public scrollLeft(): void {
        this.slideshow.nativeElement.scrollLeft -= RelatedCardsComponent.SCROLL_OFFSET;
    }

    public scrollRight(): void {
        this.slideshow.nativeElement.scrollLeft += RelatedCardsComponent.SCROLL_OFFSET;
    }

    /**
     * Update the state of the scroll buttons (left and right) according to the
     * current scroll position and the size of the slideshow.
     */
    public updateButtonsState(): void {
        const slideshow = this.slideshow.nativeElement;

        this.scrollBarAtLeft = slideshow.scrollLeft == 0;
        this.scrollBarAtRight = slideshow.scrollWidth - slideshow.scrollLeft == slideshow.clientWidth;
        this.hasScrollbar = slideshow.scrollWidth > slideshow.clientWidth;
    }

    public reduce(isReduced: boolean): void {
        this.reduced.emit(isReduced);
    }

    /**
     * Called when the input card is changed to update the corresponding
     * query variable with the new card id.
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
