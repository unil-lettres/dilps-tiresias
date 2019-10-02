import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NaturalDataSource, NaturalPageEvent } from '@ecodev/natural';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ViewInterface } from '../list/list.component';

@Component({
    selector: 'app-view-map',
    templateUrl: './view-map.component.html',
    styleUrls: ['./view-map.component.scss'],
})
export class ViewMapComponent implements OnInit, ViewInterface {

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
    @Output() public selection: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor() {
    }

    ngOnInit() {
    }

    public selectAll(): any[] {
        return [];
    }

    public unselectAll(): void {
    }

}
