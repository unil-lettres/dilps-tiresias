import {
    AfterViewInit,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    OnInit,
    output,
    signal,
    viewChild,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NaturalGalleryComponent} from '@ecodev/angular-natural-gallery';
import {NaturalDataSource, PaginationInput} from '@ecodev/natural';
import {
    CustomEventDetailMap,
    Item,
    LabelVisibility,
    ModelAttributes,
    NaturalGalleryOptions,
} from '@ecodev/natural-gallery-js';
import {filter} from 'rxjs/operators';
import {CardService} from '../card/services/card.service';
import {ViewInterface} from '../list/list.component';
import {HistoricIconComponent} from '../shared/components/historic-icon/historic-icon.component';
import {Cards} from '../shared/generated-types';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

export type ContentChange = {
    visible?: number;
    total?: number;
    hasHistoric?: boolean;
};

type GalleryModel = Cards['cards']['items'][0] & ModelAttributes;

@Component({
    selector: 'app-view-grid',
    imports: [NaturalGalleryComponent, HistoricIconComponent, MatProgressSpinner],
    templateUrl: './view-grid.component.html',
    styleUrl: './view-grid.component.scss',
})
export class ViewGridComponent implements OnInit, ViewInterface, AfterViewInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    private readonly destroyRef = inject(DestroyRef);

    /**
     * Only used to help typescript understand the generic type of <natural-gallery>
     */
    protected readonly emptyItemsList: GalleryModel[] = [];

    /**
     * Reference to gallery
     */
    public readonly gallery = viewChild<NaturalGalleryComponent<GalleryModel>>('gallery');

    /**
     * DataSource containing cards
     */
    public readonly dataSource = input.required<NaturalDataSource<Cards['cards']>>();
    /**
     *
     */
    public readonly selected = input<Cards['cards']['items'][0][]>([]);

    /**
     * Emits when data is required
     */
    protected readonly pagination = output<PaginationInput>();

    /**
     * Emits number of visible items in dom and number of total items
     */
    protected readonly contentChange = output<ContentChange>();

    /**
     * Emits when some cards are selected
     */
    protected readonly selectionChange = output<Cards['cards']['items'][0][]>();

    /**
     * The margin-top size in px for the scrollable area.
     */
    public readonly scrolledMarginTop = input<string>();

    /**
     * Indicates if there are more items to load
     */
    protected readonly hasMoreItems = signal(true);

    /**
     * Reference to scrollable element
     */
    private readonly scrollable = viewChild<ElementRef<HTMLElement>>('scrollable');

    /**
     * Vertical scroll position cache
     */
    private scrollTop = 0;

    /**
     * Row height of thumbnails in grid
     */
    private thumbnailHeight = 300;

    /**
     * Lightbox image dimension
     */
    private enlargedHeight = 2000;
    private originalHistoricIcon: HTMLElement | null = null;
    private currentHasHistoricImages = false;

    private readonly routerEvents$ = this.router.events.pipe(
        takeUntilDestroyed(),
        filter(event => event instanceof NavigationEnd),
    );

    protected options: NaturalGalleryOptions = {
        gap: 5,
        labelVisibility: LabelVisibility.ALWAYS,
        rowHeight: this.thumbnailHeight,
        activable: true,
        selectable: true,
        lightbox: true,
        photoSwipePluginsInitFn: lightbox => {
            lightbox.on('uiRegister', () => {
                // Link to card button
                // https://photoswipe.com/adding-ui-elements/#adding-a-button-to-the-toolbar
                lightbox.pswp.ui.registerElement({
                    name: 'card-button',
                    ariaLabel: 'Voir la fiche',
                    order: 5,
                    isButton: true,
                    html: 'Voir la fiche',
                    onClick: () => {
                        this.activate(lightbox.pswp.currSlide.data.item.model);
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
                    html: {
                        isCustomSVG: true,
                        inner: '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
                        outlineID: 'pswp__icn-download',
                    },
                    onInit: (el: any, pswp: any) => {
                        el.setAttribute('download', '');
                        el.setAttribute('target', '_blank');
                        el.setAttribute('rel', 'noopener');
                        pswp.on('change', () => (el.href = pswp.currSlide.data.src));
                    },
                });

                // Historic icon
                lightbox.pswp.ui.registerElement({
                    name: 'historic-icon',
                    order: 7,
                    isButton: false,
                    html: this.getHistoricIcon(35)?.outerHTML || '',
                    onInit: (el: HTMLElement, pswp: any) => {
                        const updateVisibility = (): void => {
                            const card = pswp.currSlide?.data.item.model;
                            el.style.opacity = card?.showHistoric ? '1' : '0';
                        };
                        updateVisibility();
                        pswp.on('change', updateVisibility);
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
        this.options.labelVisibility =
            sessionStorage.getItem('showLabels') === 'false' ? LabelVisibility.HOVER : LabelVisibility.ALWAYS;
    }

    public ngOnInit(): void {
        this.dataSource()
            .internalDataObservable.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(result => {
                const gallery = this.gallery();
                if (!gallery || !result) {
                    return;
                }

                gallery.gallery.then(gallery => {
                    if (!result.offset && gallery.collection.length) {
                        this.currentHasHistoricImages = false;
                        this.hasMoreItems.set(true);
                        gallery.clear(); // fires new loadMore() call
                    } else {
                        const hasHistoric = result.items.some(card => card.showHistoric);
                        if (hasHistoric) {
                            this.currentHasHistoricImages = true;
                        }
                        gallery.addItems(this.formatImages(result.items));

                        this.hasMoreItems.set(gallery.collection.length < result.length);
                    }
                });

                this.contentChange.emit({total: result.length, hasHistoric: this.currentHasHistoricImages});
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

    protected loadMore(ev: CustomEventDetailMap<GalleryModel>['pagination']): void {
        this.pagination.emit({offset: ev.offset, pageSize: ev.limit});
    }

    protected activate(item: GalleryModel): void {
        this.router.navigate(['card', item.id]);
    }

    public selectAll(): Promise<GalleryModel[]> {
        return (
            this.gallery()?.gallery.then(gallery => gallery.selectDomCollection().map(i => i.model)) ??
            Promise.resolve([])
        );
    }

    public unselectAll(): void {
        this.gallery()?.gallery.then(gallery => gallery.unselectAllItems());
    }

    private formatImages(cards: Cards['cards']['items'][0][]): GalleryModel[] {
        const selected = this.selected().map(c => c.id);

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

            return {
                ...card,
                ...thumb,
                ...big,
                ...fields,
            };
        });
    }

    protected bindModel(event: Item<GalleryModel>[]): GalleryModel[] {
        return event.map(i => i.model);
    }

    protected itemAddedToDom(item: Item<GalleryModel>): void {
        if (!item.model.showHistoric) {
            return;
        }

        const icon = this.getHistoricIcon();
        if (icon) {
            const caption = item.rootElement?.querySelector('figcaption button');
            caption?.classList.add('historic');
            caption?.prepend(icon);
        }
    }

    private getHistoricIcon(heightPx?: number): HTMLElement | null {
        if (!this.originalHistoricIcon) {
            this.originalHistoricIcon = document.querySelector('#original-historic-icon');
        }

        if (!this.originalHistoricIcon) {
            return null;
        }

        const duplicatedIcon = this.originalHistoricIcon.cloneNode(true) as HTMLElement;
        duplicatedIcon.removeAttribute('id');

        if (heightPx) {
            duplicatedIcon.style.height = `${heightPx}px`;
        }

        return duplicatedIcon;
    }
}
