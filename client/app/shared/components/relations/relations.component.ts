import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { PaginatedDataSource } from '../../services/paginated.data.source';
import { IncrementSubject } from '../../services/increment-subject';
import { LinkMutationService } from '../../services/link-mutation.service';

/**
 * Custom template usage :
 * <app-relations [main]="owner" [service]="svc" [filters]="{}" placeholder="Select an item">
 *     <ng-template let-item="item">
 *         <span>{{ item.xxx }}</span>
 *     </ng-template>
 * </app-relations>
 */

@Component({
    selector: 'app-relations',
    templateUrl: './relations.component.html',
    styleUrls: ['./relations.component.scss'],
})
export class RelationsComponent implements OnInit {

    @ContentChild(TemplateRef, {static: true}) itemTemplate: TemplateRef<any>;

    @Output() select = new EventEmitter();

    @Input() service;
    @Input() placeholder;

    @Input() set filters(filters) {
        this.listingOptions.patch({filters: filters});
    }

    /**
     * Function to customize the rendering of the selected item as text in input
     */
    @Input() displayWith: (any) => string;

    /**
     *
     */
    @Input() items;

    /**
     * Whether the disabled can be changed
     */
    @Input() disabled: boolean;

    /**
     * Main object relations belong to
     */
    @Input() main;

    /**
     * Selected relation (setted by app-select component)
     */
    public relation;

    /**
     * Listing service instance
     */
    public dataSource: PaginatedDataSource;

    /**
     * Observable variables/options for listing service usage and apollo watchQuery
     * @type {IncrementSubject}
     */
    private listingOptions = new IncrementSubject();

    /**
     * Manages spinning progress for add action
     */
    public loadingAdd: boolean;

    /**
     * Manages spinning progress for remove action
     */
    public loadingRemove: boolean;

    constructor(private linkMutationService: LinkMutationService) {
    }

    ngOnInit() {
    }

    /**
     * Unlink action
     * Refetch result to display it in table
     * Todo : could maybe use "update" attribute of apollo.mutate function to update table faster (but hard to do it here)
     * @param relation
     */
    public unlink(event, relation) {
        event.preventDefault();
        event.stopPropagation();

        this.loadingRemove = true;
        const index = this.items.findIndex(i => i.id === relation.id);
        if (index > -1) {
            this.linkMutationService.unlink(this.main, relation).subscribe(() => {
                this.items.splice(index, 1);
                this.loadingRemove = false;
                this.relation = null;
            });
        }
    }

    /**
     * Link action
     * Refetch result to display it in table
     * Todo : could maybe use "update" attribute of apollo.mutate function to update table faster (but hard to do it here)
     * @param relation
     */
    public link(relation) {
        this.loadingAdd = true;
        const index = this.items.findIndex(i => i.id === relation.id);
        if (index === -1) {
            this.linkMutationService.link(this.main, relation).subscribe(() => {
                this.items.push(relation);
                this.loadingAdd = false;
                this.relation = null;
            });
        }
    }

    public getDisplayFn(): (item: any) => string {
        if (this.displayWith) {
            return this.displayWith;
        }

        return (item) => item ? item.fullName || item.name : '';
    }

    public selectItem(item) {
        this.select.emit(item);
    }

}
