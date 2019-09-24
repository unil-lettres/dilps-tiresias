import { Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { QueryRef } from 'apollo-angular';
import { isObject, merge } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, sampleTime, startWith } from 'rxjs/operators';
import { AbstractModelService } from '../../services/abstract-model.service';
import { IncrementSubject } from '../../services/increment-subject';
import { Literal } from '../../types';

/**
 * Default usage:
 * <app-select [service]="amazingSvcInstance" [(model)]="amazingModel" (modelChange)=amazingChangeFn($event)></app-select>
 *
 * Custom template usage :
 * <app-select [service]="svc" [(model)]="model">
 *     <ng-template let-item="item">
 *         <span>{{ item.xxx }}</span>
 *     </ng-template>
 * </app-select>
 *
 * [(model)] and (modelChange) are optional
 *
 * Placeholder :
 * <app-select placeholder="amazing placeholder">
 *
 * Never float placeholder :
 * <app-select placeholder="amazing placeholder" floatPlaceholder="never">
 */
@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
})
export class SelectComponent implements OnInit {

    @ViewChild(MatAutocompleteTrigger, {static: true}) autoTrigger: MatAutocompleteTrigger;
    @ViewChild('input', {static: true}) input: ElementRef;
    @ContentChild(TemplateRef, {static: true}) itemTemplate: TemplateRef<any>;

    /**
     * Service with watchAll function that accepts queryVariables.
     */
    @Input() service;
    @Input() items: Literal[];
    @Input() placeholder: string;
    @Input() floatPlaceholder: string = null;
    @Input() autoActiveFirstOption = false;
    @Input() readonly = false;

    /**
     * The filter attribute to bind when searching for a term
     */
    @Input() searchField = 'search';

    /**
     * Whether to show the search icon
     */
    @Input() showIcon = true;

    /**
     * Additional filters for query
     */
    @Input() filters: any = {};

    /**
     * Function to customize the rendering of the selected item as text in input
     */
    @Input() displayWith: (any) => string;

    /**
     * Model output
     * Usage : (modelChange)
     */
    @Output() modelChange = new EventEmitter();

    /**
     * On selection change
     * Usage (change)="myFunction($event)"
     */
    @Output() change = new EventEmitter();

    @Output() blur = new EventEmitter();

    /**
     * Current selection
     */
    public selected;

    /**
     * Items returned by server to show in listing
     */
    public filteredItems: Observable<any[]>;
    public formCtrl: FormControl = new FormControl();
    public loading = false;
    public ac;

    /**
     * Number of items not shown in result list
     * Shows a message after list if positive
     */
    public moreNbItems = 0;
    private queryRef: QueryRef<any>;

    /**
     * Default page size
     */
    private pageSize = 10;

    /**
     * Init search options
     */
    private options: IncrementSubject;

    /**
     * Filter options debounced.
     * Used by the query
     */
    private optionsFiltered: BehaviorSubject<Literal>;

    constructor() {
    }

    /**
     * Allow to select a model
     * Usage : [model]
     */
    @Input() set model(val) {
        this.selected = val;
    }

    ngOnInit() {

        const useService = this.useService();
        const useList = this.useList();

        if (!useService && !useList) {
            throw new TypeError('No source data provided');
        }

        if (useService) {
            this.initFromService();
        } else if (useList) {
            this.initFromList();
        }

        this.input.nativeElement.addEventListener('blur', () => this.blur.emit());
    }

    public startSearch() {

        /**
         * Start search only once
         */
        if (this.queryRef) {
            return;
        }

        this.loading = true;

        this.optionsFiltered.subscribe((data) => {
            if (data.filters[this.searchField]) {
                this.loading = true;
            }
        });

        // Init query
        this.queryRef = this.service.watchAll(this.optionsFiltered);

        // When query results arrive, start loading, and count items
        this.queryRef.valueChanges.subscribe((data: any) => {
            this.loading = false;

            const nbTotal = data.length;
            const nbListed = Math.min(data.length, this.pageSize);
            this.moreNbItems = nbTotal - nbListed;

            if (data.length === 1) {
                this.selected = data.items[0];
                this.notify(data.items[0]);
            }
        });

        this.filteredItems = this.queryRef.valueChanges.pipe(map((data: any) => data.items));
    }

    public notify(ev) {
        this.modelChange.emit(ev && ev.option ? ev.option.value : ev);
        this.change.emit(ev && ev.option ? ev.option.value : ev);
    }

    public getDisplayFn(): (item: any) => string {
        if (this.displayWith) {
            return this.displayWith;
        }

        return (item) => item ? item.name : '';
    }

    public clearListSearch() {
        this.formCtrl.setValue(null);
        this.selected = null;
        this.notify(null);
    }

    public clearServiceSearch() {
        const options = {filters: {}};
        options.filters[this.searchField] = null;
        this.options.patch(options);
        this.formCtrl.setValue(null);
    }

    public searchInService(ev) {
        this.selected = ev;
        const options = {filters: {}};
        options.filters[this.searchField] = ev;
        this.options.patch(options);
    }

    public unselect() {
        if (this.useService()) {
            this.clearServiceSearch();
        } else if (this.useList()) {
            this.clearListSearch();
        }
    }

    private useService() {

        if (!this.service) {
            return false;
        } else if (this.service && this.service instanceof AbstractModelService) {
            return true;
        }

        throw new TypeError('Service does not inherit AbstractModelService');
    }

    private useList() {
        return !!this.items;
    }

    private initFromService() {
        const options = {
            filters: {},
            pagination: {
                pageIndex: 0,
                pageSize: this.pageSize,
            },
        };

        options.filters[this.searchField] = null;
        this.options = new IncrementSubject(options);
        this.optionsFiltered = new BehaviorSubject<Literal>(options);

        // Debounce search...
        // ...and filter only string search terms (when an item is selected, the value is an object)
        this.options.pipe(sampleTime(400), filter(val => {
            return !isObject(val.filters[this.searchField]); // prevent to emit when value is an object
        })).subscribe(data => {
            this.optionsFiltered.next(merge({}, {filters: this.filters}, data));
        });

        // Bind events on search field
        this.formCtrl.valueChanges.subscribe(val => this.searchInService(val));
        this.input.nativeElement.addEventListener('focus', () => this.startSearch());
        this.input.nativeElement.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.keyCode === 27) {
                this.clearServiceSearch();
            }
        });
    }

    private initFromList() {

        if (this.searchField === 'search') {
            this.searchField = 'name';
        }

        this.input.nativeElement.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.keyCode === 27) {
                this.clearListSearch();
            }
        });

        this.filteredItems = this.formCtrl.valueChanges
                                 .pipe(
                                     startWith(''),
                                     map((searchedTerm: any) => {
                                         return searchedTerm ? this.filterList(searchedTerm) : this.items.slice();
                                     }),
                                 );
    }

    private filterList(searchedTerm) {

        if (searchedTerm.name) {
            return [searchedTerm];
        }

        return this.items.filter(i => {
            return i[this.searchField].toLowerCase().indexOf(searchedTerm.toLowerCase()) > -1;
        });
    }

}
