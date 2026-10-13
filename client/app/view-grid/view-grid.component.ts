import {
    Component,
    DestroyRef,
    effect,
    inject,
    input,
    model,
    type OnInit,
    output,
    signal,
    viewChild,
    ChangeDetectionStrategy,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NaturalGalleryComponent} from '@ecodev/angular-natural-gallery';
import {type NaturalDataSource, type PaginationInput} from '@ecodev/natural';
import {
    type CustomEventDetailMap,
    type Item,
    LabelVisibility,
    type ModelAttributes,
    type NaturalGalleryOptions,
    type VisibleCollectionChange,
} from '@ecodev/natural-gallery-js';
import {fromEvent} from 'rxjs';
import {filter} from 'rxjs/operators';
import {CardService} from '../card/services/card.service';
import {type ViewInterface} from '../list/list.component';
import {HistoricIconComponent} from '../shared/components/historic-icon/historic-icon.component';
import {type CardsQuery} from '../shared/generated-types';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

export type ContentChange = {
    visible?: number;
    total?: number;
    hasHistoric?: boolean;
};

type GalleryModel = CardsQuery['cards']['items'][0] & ModelAttributes;

@Component({
    selector: 'app-view-grid',
    imports: [NaturalGalleryComponent, HistoricIconComponent, MatProgressSpinner],
    templateUrl: './view-grid.component.html',
    styleUrl: './view-grid.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class ViewGridComponent implements OnInit, ViewInterface {
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
    public readonly dataSource = input.required<NaturalDataSource<CardsQuery['cards']>>();
    /**
     *
     */
    public readonly selected = input<CardsQuery['cards']['items'][0][]>([]);

    /**
     * Emits when data is required
     */
    protected readonly pagination = output<PaginationInput>();

    /**
     * Emits the number of the last card visible on screen and the number of total cards
     */
    protected readonly contentChange = output<ContentChange>();

    /**
     * Emits when some cards are selected
     */
    protected readonly selectionChange = output<CardsQuery['cards']['items'][0][]>();

    /**
     * Whether the selection mode of the gallery is active
     */
    public readonly selectionModeActive = model(false);

    /**
     * The element scrolling the gallery, used for the infinite scroll and to
     * restore the scroll position.
     */
    public readonly scrollable = input.required<HTMLElement>();

    /**
     * Current pagination offset from parent.
     */
    public readonly paginationOffset = input<number | null>(null);

    /**
     * Indicates if there are more items to load
     */
    protected readonly hasMoreItems = signal(true);

    /**
     * Vertical scroll position cache
     */
    private scrollTop = 0;

    /**
     * Flag to prevent scroll restoration after gallery clear
     */
    private preventScrollRestoration = false;

    /**
     * True while the gallery is cleared, because the selection mode that the gallery leaves must not unselect the cards
     */
    private clearing = false;

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

    /**
     * Signal indicating that we are clearing the gallery and results are not yet loaded
     */
    protected readonly isClearing = signal(false);

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
        selectionMode: true,
        lightbox: true,
        photoSwipePluginsInitFn: lightbox => {
            lightbox.on('uiRegister', () => {
                // PhotoSwipe and the PhotoSwipe UI exist when PhotoSwipe registers the UI elements
                const pswp = lightbox.pswp!;
                const ui = pswp.ui!;

                // Link to card button
                // https://photoswipe.com/adding-ui-elements/#adding-a-button-to-the-toolbar
                ui.registerElement({
                    name: 'card-button',
                    ariaLabel: 'Voir la fiche',
                    order: 5,
                    isButton: true,
                    html: 'Voir la fiche',
                    onClick: () => {
                        this.activate(pswp.currSlide!.data.item.model);
                        pswp.destroy();
                    },
                });

                // Download button
                // https://photoswipe.com/adding-ui-elements/#adding-download-button
                ui.registerElement({
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
                ui.registerElement({
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

        // Clear gallery when pagination is reset (offset becomes null)
        effect(() => {
            const offset = this.paginationOffset();
            if (offset === null) {
                this.isClearing.set(true);
                const gallery = this.gallery();
                if (gallery) {
                    gallery.gallery.then(g => {
                        if (g.collection.length > 0) {
                            this.currentHasHistoricImages = false;

                            // The selection outlives the reload, and the selection mode outlives the reload too
                            this.clearing = true;
                            g.clear();
                            this.clearing = false;
                            if (this.selected().length) {
                                g.setSelectionModeActive(true);
                            } else {
                                this.selectionModeActive.set(false);
                            }

                            // Scroll to top and prevent restoration
                            this.scrollable().scrollTop = 0;
                            this.preventScrollRestoration = true;
                            this.scrollTop = 0;
                        }
                    });
                }
            }
        });
    }

    public ngOnInit(): void {
        this.dataSource()
            .internalDataObservable.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(result => {
                const gallery = this.gallery();
                if (!gallery || !result) {
                    return;
                }

                this.isClearing.set(false);

                gallery.gallery.then(gallery => {
                    if (result.items.length > 0) {
                        const hasHistoric = result.items.some(card => card.showHistoric);
                        if (hasHistoric) {
                            this.currentHasHistoricImages = true;
                        }
                        gallery.addItems(this.formatImages(result.items));

                        // The selected cards may not be part of the displayed items, for example after a switch from the list view
                        if (this.selected().length && !gallery.selectionModeActive) {
                            gallery.setSelectionModeActive(true);
                        }

                        this.hasMoreItems.set(gallery.collection.length < result.length);

                        // Allow scroll restoration after items are added
                        setTimeout(() => {
                            this.preventScrollRestoration = false;
                        }, 200);
                    }
                });

                this.contentChange.emit({total: result.length, hasHistoric: this.currentHasHistoricImages});
            });

        // Cache the scroll position. The scrollable outlives this component,
        // so stop listening when destroyed.
        fromEvent(this.scrollable(), 'scroll')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                const scroll = this.scrollable().scrollTop;
                if (scroll > 0) {
                    this.scrollTop = scroll;
                }
            });

        // Restore scroll when component is retrieved from reuse strategy
        this.routerEvents$.subscribe(() => {
            const restoreScroll = this.lastCollectionId === this.route.snapshot?.data?.collection?.id;
            this.lastCollectionId = this.route.snapshot?.data?.collection?.id;

            setTimeout(() => {
                if (restoreScroll && !this.preventScrollRestoration) {
                    this.scrollable().scrollTop = this.scrollTop;
                }
            }, 200);
        });
    }

    protected visibleCollectionChange(change: VisibleCollectionChange<GalleryModel>): void {
        this.contentChange.emit({visible: change.lastIndex + 1});
    }

    protected loadMore(ev: CustomEventDetailMap<GalleryModel>['pagination']): void {
        this.pagination.emit({offset: ev.offset, pageSize: ev.limit});
    }

    protected activate(item: GalleryModel): void {
        this.router.navigate(['card', item.id]);
    }

    /**
     * The gallery unselects only the cards that the gallery displays, so the grid also unselects the cards selected
     * before the last search when the gallery leaves the selection mode
     */
    protected selectionModeChange(active: boolean): void {
        if (this.clearing) {
            return;
        }

        this.selectionModeActive.set(active);
        if (!active && this.selected().length) {
            this.selectionChange.emit([]);
        }
    }

    public unselectAll(): void {
        this.gallery()?.gallery.then(gallery => gallery.setSelectionModeActive(false));
    }

    private formatImages(cards: CardsQuery['cards']['items'][0][]): GalleryModel[] {
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

    protected itemElementCreated(item: Item<GalleryModel>): void {
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
