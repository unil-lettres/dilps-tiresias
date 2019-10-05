import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { NaturalAbstractController, NaturalDataSource, NaturalPageEvent } from '@ecodev/natural';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ViewInterface } from '../list/list.component';

@Component({
    selector: 'app-view-list',
    templateUrl: './view-list.component.html',
    styleUrls: ['./view-list.component.scss'],
})
export class ViewListComponent extends NaturalAbstractController implements OnInit, ViewInterface {

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

    public selectionModel = new SelectionModel(true);

    constructor() {
        super();
    }

    ngOnInit() {
        this.selectionModel.changed.subscribe(() => this.selectionChange.emit(this.selectionModel.selected));
    }

    public loadMore(event: PageEvent) {
        this.selectionModel.clear();
        this.pagination.emit(event as NaturalPageEvent);
    }

    public selectAll(): any[] {
        this.selectionModel.select(...this.dataSource.data.items);
        return this.selectionModel.selected;
    }

    public unselectAll(): void {
        this.selectionModel.clear();
    }
}
