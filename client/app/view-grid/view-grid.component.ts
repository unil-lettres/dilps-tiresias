import {
    AfterViewInit,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    Input,
    OnInit,
    output,
    viewChild,
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NaturalGalleryComponent} from '@ecodev/angular-natural-gallery';
import {NaturalDataSource, PaginationInput} from '@ecodev/natural';
import {CustomEventDetailMap, ModelAttributes, NaturalGalleryOptions} from '@ecodev/natural-gallery-js';
import {merge} from 'lodash-es';
import {filter} from 'rxjs/operators';
import {CardService} from '../card/services/card.service';
import {ViewInterface} from '../list/list.component';
import {Cards} from '../shared/generated-types';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export type ContentChange = {
    visible?: number;
    total?: number;
};

type GalleryItem = Cards['cards']['items'][0] & ModelAttributes;

@Component({
    selector: 'app-view-grid',
    templateUrl: './view-grid.component.html',
    styleUrl: './view-grid.component.scss',
    imports: [NaturalGalleryComponent],
})
export class ViewGridComponent implements OnInit, ViewInterface, AfterViewInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    private readonly destroyRef = inject(DestroyRef);

    /**
     * Only used to help typescript understand the generic type of <natural-gallery>
     */
    public readonly emptyItemsList: GalleryItem[] = [];

    /**
     * Reference to gallery
     */
    public readonly gallery = viewChild<NaturalGalleryComponent<GalleryItem>>('gallery');

    /**
     * DataSource containing cards
     */
    @Input({required: true}) public dataSource!: NaturalDataSource<Cards['cards']>;
    /**
     *
     */
    @Input() public selected: Cards['cards']['items'][0][] = [];

    /**
     * Emits when data is required
     */
    public readonly pagination = output<PaginationInput>();

    /**
     * Emits number of visible items in dom and number of total items
     */
    public readonly contentChange = output<ContentChange>();

    /**
     * Emits when some cards are selected
     */
    public readonly selectionChange = output<Cards['cards']['items'][0][]>();

    /**
     * The margin-top size in px for the scrollable area.
     */
    public readonly scrolledMarginTop = input<string>();

    /**
     * Reference to scrollable element
     */
    private readonly scrollable = viewChild<ElementRef<HTMLElement>>('scrollable');

    /**
     * Vertical scroll position cache
     */
    private scrollTop = 0;

    /**
     * Row height of thumbails in grid
     */
    private thumbnailHeight = 300;

    /**
     * Lightbox image dimension
     */
    private enlargedHeight = 2000;

    private readonly routerEvents$ = this.router.events.pipe(
        takeUntilDestroyed(),
        filter(event => event instanceof NavigationEnd),
    );

    public options: NaturalGalleryOptions = {
        gap: 5,
        showLabels: 'always',
        rowHeight: this.thumbnailHeight,
        activable: true,
        selectable: true,
        lightbox: true,
        photoSwipePluginsInitFn: lightbox => {
            lightbox.on('uiRegister', function () {
                // Link to card button
                // https://photoswipe.com/adding-ui-elements/#adding-a-button-to-the-toolbar
                lightbox.pswp.ui.registerElement({
                    name: 'card-button',
                    ariaLabel: 'Voir la fiche',
                    order: 5,
                    isButton: true,
                    html: 'Voir la fiche',

                    onClick: () => {
                        // Since we have no way to access the card id from PhotoSwipe,
                        // we simulate a click on the thumbnail's button.
                        lightbox.pswp.currSlide.data.element.querySelector('.button.activable').click();
                        lightbox.pswp.destroy();
                    },
                });

                // Download button
                // https://photoswipe.com/adding-ui-elements/#adding-download-button
                lightbox.pswp.ui.registerElement({
                    name: 'download-button',
                    order: 8,
                    isButton: true,
                    tagName: 'a',

                    // SVG with outline
                    html: {
                        isCustomSVG: true,
                        inner: '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
                        outlineID: 'pswp__icn-download',
                    },

                    onInit: (el: any, pswp: any) => {
                        el.setAttribute('download', '');
                        el.setAttribute('target', '_blank');
                        el.setAttribute('rel', 'noopener');

                        pswp.on('change', () => {
                            el.href = pswp.currSlide.data.src;
                        });
                    },
                });
            });
        },
        infiniteScrollOffset: -1000,
        ratioLimit: {
            min: 0.5,
            max: 2,
        },
    };

    private lastCollectionId = 0;

    public constructor() {
        this.options.showLabels = sessionStorage.getItem('showLabels') === 'false' ? 'hover' : 'always';
    }

    public ngOnInit(): void {
        this.dataSource.internalDataObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
            const gallery = this.gallery();
            if (!gallery || !result) {
                return;
            }

            gallery.gallery.then(gallery => {
                if (!result.offset && gallery.collection.length) {
                    gallery.clear(); // fires new loadMore() call
                } else {
                    gallery.addItems(this.formatImages(result.items));
                }
            });

            this.contentChange.emit({total: result.length});
        });

        // Cache scroll when user... scrolls
        this.scrollable()?.nativeElement.addEventListener('scroll', () => {
            const scroll = this.scrollable()?.nativeElement.scrollTop;
            if (scroll && scroll > 0) {
                this.scrollTop = scroll;
            }
        });

        // Restore scroll when component is retrieved from reuse strategy
        this.routerEvents$.subscribe(() => {
            const restoreScroll = this.lastCollectionId === this.route.snapshot?.data?.collection?.id;
            this.lastCollectionId = this.route.snapshot?.data?.collection?.id;

            setTimeout(() => {
                const scrollable = this.scrollable();
                if (restoreScroll && scrollable) {
                    scrollable.nativeElement.scrollTop = this.scrollTop;
                }
            }, 200);
        });
    }

    public ngAfterViewInit(): void {
        this.gallery()?.gallery.then(gallery =>
            gallery.addEventListener('item-added-to-dom', () => {
                this.contentChange.emit({visible: gallery.domCollection.length});
            }),
        );
    }

    public loadMore(ev: CustomEventDetailMap<GalleryItem>['pagination']): void {
        this.pagination.emit({offset: ev.offset, pageSize: ev.limit});
    }

    public activate(event: CustomEventDetailMap<GalleryItem>['activate']): void {
        this.router.navigate(['card', event.model.id]);
    }

    public selectAll(): Promise<Cards['cards']['items'][0][]> {
        return this.gallery()?.gallery.then(gallery => gallery.selectVisibleItems()) ?? Promise.resolve([]);
    }

    public unselectAll(): void {
        this.gallery()?.gallery.then(gallery => gallery.unselectAllItems());
    }

    private formatImages(cards: Cards['cards']['items'][0][]): GalleryItem[] {
        const selected = this.selected.map(c => c.id);

        return cards.map(card => {
            const cardWithThumb = CardService.formatImage(card, this.thumbnailHeight);
            const cardWithBig = CardService.formatImage(card, this.enlargedHeight);

            const thumb = {
                thumbnailSrc: cardWithThumb.src,
                thumbnailWidth: cardWithThumb.width,
                thumbnailHeight: cardWithThumb.height,
            };

            const big = {
                enlargedSrc: cardWithBig.src,
                enlargedWidth: cardWithBig.width,
                enlargedHeight: cardWithBig.height,
            };

            let title = card.name ? card.name : null;
            const artists = card.artists.map(a => a.name).join('<br/>');

            if (artists && title) {
                title = '[ ' + artists + ' ] ' + title;
            } else if (artists && !title) {
                title = artists;
            }

            if (card.code) {
                title = '[ ' + card.code + ' ] ' + title;
            }

            const fields: any = {
                title: title ? title : 'Éditer la fiche',
                selected: selected.includes(card.id),
            };

            return merge({}, card, thumb, big, fields);
        });
    }
}
