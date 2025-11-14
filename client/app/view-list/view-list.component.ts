import {SelectionModel} from '@angular/cdk/collections';
import {Component, DestroyRef, inject, Input, input, OnInit, output} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {NaturalDataSource} from '@ecodev/natural';
import {intersectionBy} from 'es-toolkit';
import {ViewInterface} from '../list/list.component';
import {CardService} from '../card/services/card.service';
import {HistoricIconComponent} from '../shared/components/historic-icon/historic-icon.component';
import {Cards, Site} from '../shared/generated-types';
import {TruncatePipe} from '../shared/pipes/truncate.pipe';
import {OnlyLeavesPipe} from '../shared/pipes/only-leaves.pipe';
import {StripTagsPipe} from '../shared/pipes/strip-tags.pipe';
import {MatCheckbox} from '@angular/material/checkbox';
import {RouterLink} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-view-list',
    imports: [
        MatPaginator,
        RouterLink,
        MatCheckbox,
        StripTagsPipe,
        OnlyLeavesPipe,
        TruncatePipe,
        HistoricIconComponent,
    ],
    templateUrl: './view-list.component.html',
    styleUrl: './view-list.component.scss',
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
    public readonly selected = input<Cards['cards']['items'][0][]>([]);
    public selectionModel = new SelectionModel<Cards['cards']['items'][0]>(true);
    public cards: Cards['cards']['items'][0][] = [];

    /**
     * The margin-top size in px for the scrollable area.
     */
    public readonly scrolledMarginTop = input<string>();

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
                this.selectionModel.select(...intersectionBy(cards, this.selected(), c => c.id));
            });

        this.selectionModel.changed.subscribe(() => this.selectionChange.emit(this.selectionModel.selected));
    }

    protected loadMore(event: PageEvent): void {
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

    protected getCardAddress(card: Cards['cards']['items'][0]): string {
        return [card.street, card.postcode, card.locality, card.country?.name].filter(v => !!v).join(', ');
    }
}
