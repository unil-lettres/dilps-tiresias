/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */

import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { BasicDataSource } from './basic.data.source';
import { Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as qs from 'qs';
import { get, isEmpty, merge } from 'lodash';
import { UtilityService } from './utility.service';
import { IncrementSubject } from './increment-subject';

export class PaginatedDataSource extends BasicDataSource {

    private keyPrefix = 'listing-';

    /**
     * List of default options
     * This options and values are those that should not be reflected in url.
     * Default options can be updated by passing an observable when creating a new PaginatedDataSource instance.
     */
    private defaultOptions = {
        filters: {
            search: '',
        },
        pagination: {
            pageIndex: 0,
            pageSize: 25,
        },
    };

    /**
     * For template usage (read only), prevent to access observable that degrades performances
     */
    public snapshot = {
        data: {
            items: [],
            length: 0,
        },
        options: this.defaultOptions,
    };

    private encodeParams = {
        format: 'RFC1738',
        encode: false,
        indices: false,
        allowDots: true,
        delimiter: ';',
    };

    /**
     * List of pagination options
     * @type {[number , number , number , number , number]}
     */
    public readonly pageSizeOptions = [
        1,
        5,
        10,
        25,
        50,
        100,
        200,
    ];

    /**
     *
     * @param {Observable<any> | any} data List of items
     * @param {IncrementSubject} listingOptions Observable that represents filter and pagination. Should be sent to apollo to update query.
     * @param {Observable<any> | Object} defaultOptions Listing options default values. Prevent those values to be displayed in url/storage
     * @param {boolean} persist Wherever listing options should be stored in url and localstorage
     * @param {Router} router
     * @param {ActivatedRoute} route Current route
     * @param {string} key Identifier to store listing options in localstorage
     */
    constructor(data: Observable<any> | any,
                private listingOptions = null,
                defaultOptions: Observable<any> | Object = {},
                private persist: boolean = false,
                @Inject(Router) private router: Router = null,
                @Inject(ActivatedRoute) private route: ActivatedRoute = null,
                private key: string = null) {

        super(data);

        if (defaultOptions instanceof Observable) {
            defaultOptions.subscribe(opts => {
                merge(this.defaultOptions, opts);
            });
        } else {
            merge(this.defaultOptions, defaultOptions);
        }

        // Update snapshot data when items change
        if (data instanceof Observable) {
            data.subscribe(result => (this.snapshot.data = result));
        } else {
            this.snapshot.data = data;
        }

        // if not provided, options are not persisted neither recovered from storage
        if (this.listingOptions) {
            this.initOptions();
        }
    }

    get options() {
        return this.snapshot.data;
    }

    public getOption(path): Observable<Object> {
        return this.listingOptions.map(o => get(o, path));
    }

    /**
     * Update the search filter
     */
    public updateOptions(val) {
        this.listingOptions.patch(val);
    }

    /**
     * Helper to simplify filters setting (shortcut for updateOptions({filters: val});
     */
    public filter(val) {
        this.updateOptions({filters: val});
    }

    /**
     * Helper to simplify pagination setting (shortcut for updateOptions({pagination: {...}});
     * @param {PageEvent} event
     */
    public paging(event: PageEvent) {
        this.updateOptions({
            pagination: {
                pageIndex: +event.pageIndex,
                pageSize: +event.pageSize,
            },
        });
    }

    /**
     * Load persisted data
     */
    public initOptions() {

        // Local storaged
        let savedOptions = JSON.parse(localStorage.getItem(this.getKey()));
        savedOptions = !isEmpty(savedOptions) ? savedOptions : null;

        // From url
        let urlOptions = this.router ? qs.parse(this.route.snapshot.params.options, this.encodeParams) : null;
        urlOptions = !isEmpty(urlOptions) ? urlOptions : null;

        // Merge with default options
        const options = merge({}, this.defaultOptions, urlOptions ? urlOptions : savedOptions);

        // A single url option override all local storaged options for use case where url is sent to anyone
        if (this.persist) {
            this.listingOptions.next(options);
            this.listingOptions.subscribe(data => this.saveOptions(data));
        }
    }

    /**
     * Persist option in url and local storage
     * Is called each time this.optionsObs change
     * @param options
     */
    private saveOptions(options) {

        // Store actual options in snapshot
        this.snapshot.options = options;

        // Remove default values from options, to prevent useless data in url that shows up unconditionally
        const cleanedOptions = UtilityService.cleanSameValues(merge({}, options), this.defaultOptions);
        const serialized = qs.stringify(cleanedOptions, this.encodeParams);

        // Merge options with other matrix params, and clean options key if empty string
        options = {options: serialized};
        if (options.options === '') {
            delete options.options;
        }

        // Set cleaned options in url and localstorage
        if (this.persist) {
            this.router.navigate([
                '.',
                options,
            ], {relativeTo: this.route});
            localStorage.setItem(this.getKey(), JSON.stringify(cleanedOptions));
        }
    }

    /**
     * Get local storage key
     * @returns {string}
     */
    private getKey() {
        return this.keyPrefix + this.key;
    }

}
