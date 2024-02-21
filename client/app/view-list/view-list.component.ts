import {SelectionModel} from '@angular/cdk/collections';
import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from '@angular/core';
import {PageEvent, MatPaginatorModule} from '@angular/material/paginator';
import {NaturalAbstractController, NaturalDataSource} from '@ecodev/natural';
import {intersectionBy} from 'lodash-es';
import {ViewInterface} from '../list/list.component';
import {CardService} from '../card/services/card.service';
import {Cards, Site} from '../shared/generated-types';
import {TruncatePipe} from '../shared/pipes/truncate.pipe';
import {OnlyLeavesPipe} from '../shared/pipes/only-leaves.pipe';
import {StripTagsPipe} from '../shared/pipes/strip-tags.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-view-list',
    templateUrl: './view-list.component.html',
    styleUrls: ['./view-list.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatPaginatorModule,
        RouterLink,
        MatCheckboxModule,
        StripTagsPipe,
        OnlyLeavesPipe,
        TruncatePipe,
    ],
})
export class ViewListComponent extends NaturalAbstractController implements OnInit, ViewInterface {
    private readonly destroyRef = inject(DestroyRef);

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
            .pipe(takeUntilDestroyed(this.destroyRef))
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

    public getCardAddress(card: Cards['cards']['items'][0]): string {
        return [card.street, card.postcode, card.locality, card.country?.name].filter(v => !!v).join(', ');
    }
}
