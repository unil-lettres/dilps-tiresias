import {SelectionModel} from '@angular/cdk/collections';
import {Component, DestroyRef, inject, Input, OnInit, output} from '@angular/core';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {NaturalDataSource} from '@ecodev/natural';
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
    styleUrl: './view-list.component.scss',
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
export class ViewListComponent implements OnInit, ViewInterface {
    private readonly destroyRef = inject(DestroyRef);

    /**
     * DataSource containing cards
     */
    @Input({required: true}) public dataSource!: NaturalDataSource<Cards['cards']>;

    /**
     * Emits when data is required
     */
    public readonly pagination = output<PageEvent>();

    /**
     * Emits when some cards are selected
     */
    public readonly selectionChange = output<Cards['cards']['items'][0][]>();
    @Input() public selected: Cards['cards']['items'][0][] = [];
    public selectionModel = new SelectionModel<Cards['cards']['items'][0]>(true);
    public cards: Cards['cards']['items'][0][] = [];

    /**
     * Template exposed variable
     */
    public Site = Site;
    public readonly CardService = CardService;

    public ngOnInit(): void {
        this.dataSource
            .connect()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(cards => {
                this.cards = cards;
                this.selectionModel.clear();
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
