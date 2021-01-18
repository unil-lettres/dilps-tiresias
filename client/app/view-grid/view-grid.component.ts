import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {NaturalGalleryComponent} from '@ecodev/angular-natural-gallery';
import {NaturalAbstractController, NaturalDataSource, PaginationInput} from '@ecodev/natural';
import {NaturalGalleryOptions} from '@ecodev/natural-gallery-js';
import {merge} from 'lodash-es';
import {takeUntil} from 'rxjs/operators';
import {CardService} from '../card/services/card.service';
import {ViewInterface} from '../list/list.component';
import {Cards_cards, Cards_cards_items} from '../shared/generated-types';

export interface ContentChange {
    visible?: number;
    total?: number;
}

@Component({
    selector: 'app-view-grid',
    templateUrl: './view-grid.component.html',
    styleUrls: ['./view-grid.component.scss'],
})
export class ViewGridComponent extends NaturalAbstractController implements OnInit, ViewInterface, AfterViewInit {
    /**
     * Reference to gallery
     */
    @ViewChild('gallery') public gallery: NaturalGalleryComponent;

    /**
     * DataSource containing cards
     */
    @Input() public dataSource: NaturalDataSource<Cards_cards>;

    /**
     *
     */
    @Input() public selected: Cards_cards_items[] = [];

    /**
     * Emits when data is required
     */
    @Output() public readonly pagination: EventEmitter<PaginationInput> = new EventEmitter<PaginationInput>();

    /**
     * Emits number of visible items in dom and number of total items
     */
    @Output() public readonly contentChange: EventEmitter<ContentChange> = new EventEmitter();

    /**
     * Emits when some cards are selected
     */
    @Output() public readonly selectionChange: EventEmitter<Cards_cards_items[]> = new EventEmitter<
        Cards_cards_items[]
    >();

    /**
     * Reference to scrollable element
     */
    @ViewChild('scrollable', {static: true}) private scrollable: ElementRef;

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

    public options: NaturalGalleryOptions = {
        gap: 5,
        showLabels: 'always',
        rowHeight: this.thumbnailHeight,
        activable: true,
        selectable: true,
        lightbox: true,
        infiniteScrollOffset: -200,
        ratioLimit: {
            min: 0.5,
            max: 2,
        },
    };

    constructor(private router: Router) {
        super();
    }

    public ngOnInit(): void {
        this.dataSource.internalDataObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            if (!this.gallery) {
                return;
            }

            if (!result.offset && this.gallery.gallery.collection.length) {
                this.gallery.gallery.clear(); // fires new loadMore() call
            } else {
                this.gallery.gallery.addItems(this.formatImages(result.items));
            }

            this.contentChange.emit({total: result.length});
        });

        // Cache scroll when user... scrolls
        this.scrollable.nativeElement.addEventListener('scroll', () => {
            const scroll = this.scrollable.nativeElement.scrollTop;
            if (scroll > 0) {
                this.scrollTop = scroll;
            }
        });

        // Restore scroll when component is retrieved from reuse strategy
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                setTimeout(() => {
                    this.scrollable.nativeElement.scrollTop = this.scrollTop;
                }, 200);
            }
        });
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.gallery.gallery.addEventListener('item-added-to-dom', () => {
                this.contentChange.emit({visible: this.gallery.gallery.visibleCollection.length});
            });
        });
    }

    public loadMore(ev: {offset: number; limit: number}): void {
        this.pagination.emit({offset: ev.offset, pageSize: ev.limit});
    }

    public activate(event: {model: Cards_cards_items}): void {
        this.router.navigate(['card', event.model.id]);
    }

    public selectAll(): Cards_cards_items[] {
        return this.gallery.gallery.selectVisibleItems();
    }

    public unselectAll(): void {
        this.gallery.gallery.unselectAllItems();
    }

    private formatImages(cards: Cards_cards_items[]): Cards_cards_items[] {
        const selected = this.selected.map(c => c.id);

        cards = cards.map(card => {
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
                title: title ? title : 'Voir le détail',
                selected: selected.indexOf(card.id) > -1,
            };

            return merge({}, card, thumb, big, fields);
        });

        return cards;
    }
}
