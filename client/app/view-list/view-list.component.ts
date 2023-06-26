import {SelectionModel} from '@angular/cdk/collections';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {NaturalAbstractController, NaturalDataSource} from '@ecodev/natural';
import {intersectionBy} from 'lodash-es';
import {takeUntil} from 'rxjs/operators';
import {ViewInterface} from '../list/list.component';
import {CardService} from '../card/services/card.service';
import {Cards, Site} from '../shared/generated-types';

@Component({
    selector: 'app-view-list',
    templateUrl: './view-list.component.html',
    styleUrls: ['./view-list.component.scss'],
})
export class ViewListComponent extends NaturalAbstractController implements OnInit, ViewInterface {
    /**
     * DataSource containing cards
     */
    @Input({required: true}) public dataSource!: NaturalDataSource<Cards['cards']>;

    /**
     * Emits when data is required
     */
    @Output() public readonly pagination: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

    /**
     * Emits when some cards are selected
     */
    @Output() public readonly selectionChange: EventEmitter<Cards['cards']['items'][0][]> = new EventEmitter<
        Cards['cards']['items'][0][]
    >();
    @Input() public selected: Cards['cards']['items'][0][] = [];
    public selectionModel = new SelectionModel<Cards['cards']['items'][0]>(true);
    public cards: Cards['cards']['items'][0][] = [];

    /**
     * Template exposed variable
     */
    public Site = Site;
    public readonly CardService = CardService;

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

    public selectAll(): Promise<Cards['cards']['items'][0][]> {
        if (this.dataSource.data) {
            this.selectionModel.select(...this.dataSource.data.items);
        }

        return Promise.resolve(this.selectionModel.selected);
    }

    public unselectAll(): void {
        this.selectionModel.clear();
    }

    public getInstitutionAddress(institution: NonNullable<Cards['cards']['items'][0]['institution']>): string {
        return [institution.street, institution.locality, institution.country?.name].filter(v => !!v).join(', ');
    }

    public getCardAddress(card: Cards['cards']['items'][0]): string {
        return [card.street, card.postcode, card.locality, card.country?.name].filter(v => !!v).join(', ');
    }
}
