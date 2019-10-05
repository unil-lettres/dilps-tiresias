import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NaturalGalleryComponent } from '@ecodev/angular-natural-gallery';
import { NaturalAbstractController, NaturalDataSource, NaturalPageEvent } from '@ecodev/natural';
import { NaturalGalleryOptions } from '@ecodev/natural-gallery-js';
import { merge } from 'lodash';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { takeUntil } from 'rxjs/operators';
import { CardService } from '../card/services/card.service';
import { ViewInterface } from '../list/list.component';

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
     * Reference to scrollable element
     */
    @ViewChild('scrollable', {static: true}) private scrollable: PerfectScrollbarComponent;

    /**
     * DataSource containing cards
     */
    @Input() public dataSource: NaturalDataSource;

    /**
     * Emits when data is required
     */
    @Output() public pagination: EventEmitter<NaturalPageEvent> = new EventEmitter<NaturalPageEvent>();

    /**
     * Emits when some cards are selected
     */
    @Output() public selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    private thumbnailHeight = 300;
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
        this.pagination.emit({offset: ev.offset, pageSize: ev.limit, pageIndex: null, length: null});
    }

    public activate(event) {
        this.router.navigate(['card', event.model.id]);
    }

    public selectAll(): any[] {
        return this.gallery.gallery.selectVisibleItems();
    }

    public unselectAll(): void {
        this.gallery.gallery.unselectAllItems();
    }

    private formatImages(cards) {

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

            const fields: any = {
                title: title ? title : 'Voir le détail',
            };

            return merge({}, card, thumb, big, fields);
        });

        return cards;
    }

}
