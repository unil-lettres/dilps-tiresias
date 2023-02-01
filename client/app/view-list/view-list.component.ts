import {SelectionModel} from '@angular/cdk/collections';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {NaturalAbstractController, NaturalDataSource} from '@ecodev/natural';
import {intersectionBy} from 'lodash-es';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {takeUntil} from 'rxjs/operators';
import {ViewInterface} from '../list/list.component';
import {Cards_cards, Cards_cards_items, Cards_cards_items_institution, Site} from '../shared/generated-types';

@Component({
    selector: 'app-view-list',
    templateUrl: './view-list.component.html',
    styleUrls: ['./view-list.component.scss'],
})
export class ViewListComponent extends NaturalAbstractController implements OnInit, ViewInterface {
    /**
     * DataSource containing cards
     */
    @Input() public dataSource: NaturalDataSource<Cards_cards>;

    /**
     * Emits when data is required
     */
    @Output() public readonly pagination: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

    /**
     * Emits when some cards are selected
     */
    @Output() public readonly selectionChange: EventEmitter<Cards_cards_items[]> = new EventEmitter<
        Cards_cards_items[]
    >();
    @Input() public selected: Cards_cards_items[] = [];
    public selectionModel = new SelectionModel<Cards_cards_items>(true);
    public cards: Cards_cards_items[] = [];

    /**
     * Reference to scrollable element
     */
    @ViewChild('scrollable', {static: true}) private scrollable: PerfectScrollbarComponent;

    /**
     * Template exposed variable
     */
    public Site = Site;

    public constructor() {
        super();
    }

    public ngOnInit(): void {
        this.dataSource
            .connect()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(cards => {
                this.cards = cards;
                this.selectionModel.select(...intersectionBy(cards, this.selected, 'id'));
            });

        this.selectionModel.changed.subscribe(() => this.selectionChange.emit(this.selectionModel.selected));
    }

    public loadMore(event: PageEvent): void {
        this.selectionModel.clear();
        this.pagination.emit(event);
    }

    public selectAll(): Promise<Cards_cards_items[]> {
        if (this.dataSource.data) {
            this.selectionModel.select(...this.dataSource.data.items);
        }

        return Promise.resolve(this.selectionModel.selected);
    }

    public unselectAll(): void {
        this.selectionModel.clear();
    }

    public getInstitutionAddress(institution: Cards_cards_items_institution): string {
        return [institution.street, institution.locality, institution.country?.name].filter(v => !!v).join(', ');
    }

    public getCardAddress(card: Cards_cards_items): string {
        return [card.street, card.postcode, card.locality, card.country?.name].filter(v => !!v).join(', ');
    }
}
