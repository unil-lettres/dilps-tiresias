import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { NaturalAbstractController, NaturalDataSource } from '@ecodev/natural';
import { intersectionBy } from 'lodash';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { takeUntil } from 'rxjs/operators';
import { ViewInterface } from '../list/list.component';

@Component({
    selector: 'app-view-list',
    templateUrl: './view-list.component.html',
    styleUrls: ['./view-list.component.scss'],
})
export class ViewListComponent extends NaturalAbstractController implements OnInit, ViewInterface {

    /**
     * DataSource containing cards
     */
    @Input() public dataSource: NaturalDataSource;
    /**
     * Emits when data is required
     */
    @Output() public pagination: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
    /**
     * Emits when some cards are selected
     */
    @Output() public selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Input() selected = [];
    public selectionModel = new SelectionModel(true);
    public cards = [];
    /**
     * Reference to scrollable element
     */
    @ViewChild('scrollable', {static: true}) private scrollable: PerfectScrollbarComponent;

    constructor() {
        super();

    }

    ngOnInit() {

        this.dataSource.connect().pipe(takeUntil(this.ngUnsubscribe)).subscribe(cards => {
            this.cards = cards;
            this.selectionModel.select(...intersectionBy(cards, this.selected, 'id'));
        });

        this.selectionModel.changed.subscribe(() => this.selectionChange.emit(this.selectionModel.selected));
    }

    public loadMore(event: PageEvent) {
        this.selectionModel.clear();
        this.pagination.emit(event);
    }

    public selectAll(): any[] {
        this.selectionModel.select(...this.dataSource.data.items);
        return this.selectionModel.selected;
    }

    public unselectAll(): void {
        this.selectionModel.clear();
    }
}
