import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NaturalGalleryComponent } from '@ecodev/angular-natural-gallery';
import { NaturalAbstractController, NaturalDataSource, PaginationInput } from '@ecodev/natural';
import { NaturalGalleryOptions } from '@ecodev/natural-gallery-js';
import { merge } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { CardService } from '../card/services/card.service';
import { ViewInterface } from '../list/list.component';
import { Cards_cards_items } from '../shared/generated-types';

@Component({
    selector: 'app-view-grid',
    templateUrl: './view-grid.component.html',
    styleUrls: ['./view-grid.component.scss'],
})
export class ViewGridComponent extends NaturalAbstractController implements OnInit, ViewInterface {

    /**
     * Reference to gallery
     */
    @ViewChild('gallery', {static: false}) gallery: NaturalGalleryComponent;

    /**
     * DataSource containing cards
     */
    @Input() public dataSource: NaturalDataSource<Cards_cards_items>;

    /**
     *
     */
    @Input() selected: Cards_cards_items[] = [];

    /**
     * Emits when data is required
     */
    @Output() public pagination: EventEmitter<Required<PaginationInput>> = new EventEmitter<Required<PaginationInput>>();

    /**
     * Emits when some cards are selected
     */
    @Output() public selectionChange: EventEmitter<Cards_cards_items[]> = new EventEmitter<Cards_cards_items[]>();

    /**
     * Reference to scrollable element
     */
    @ViewChild('scrollable', {static: true}) private scrollable: ElementRef;

    /**
     * Row height of thumbails in grid
     */
    private thumbnailHeight = 300;

    /**
     * Lightbox image dimension
     */
    private enlargedHeight = 2000;

    public options: NaturalGalleryOptions = {
        cover: true,
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

    ngOnInit() {

        this.dataSource.internalDataObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {

            if (!this.gallery) {
                return;
            }

            if (!result.offset && this.gallery.gallery.collection.length) {
                this.gallery.gallery.clear(); // fires new loadMore() call
            } else {
                this.gallery.gallery.addItems(this.formatImages(result.items));
            }
        });

    }

    public loadMore(ev) {
        this.pagination.emit({offset: ev.offset, pageSize: ev.limit, pageIndex: null});
    }

    public activate(event) {
        this.router.navigate(['card', event.model.id]);
    }

    public selectAll(): Cards_cards_items[] {
        return this.gallery.gallery.selectVisibleItems();
    }

    public unselectAll(): void {
        this.gallery.gallery.unselectAllItems();
    }

    private formatImages(cards: Cards_cards_items[]) {

        const selected = this.selected.map(c => c.id);

        cards = cards.map(card => {
            let thumb = CardService.formatImage(card, this.thumbnailHeight);
            let big = CardService.formatImage(card, this.enlargedHeight);

            thumb = {
                thumbnailSrc: thumb.src,
                thumbnailWidth: thumb.width,
                thumbnailHeight: thumb.height,
            };

            big = {
                enlargedSrc: big.src,
                enlargedWidth: big.width,
                enlargedHeight: big.height,
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
