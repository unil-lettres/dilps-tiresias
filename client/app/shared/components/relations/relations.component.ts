import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { IncrementSubject } from '../../services/increment-subject';
import { PaginatedDataSource } from '../../services/paginated.data.source';
import { NaturalLinkMutationService } from '@ecodev/natural';

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
     * Manages spinning progress for add action
     */
    public loadingAdd: boolean;

    /**
     * Manages spinning progress for remove action
     */
    public loadingRemove: boolean;

    /**
     * Observable variables/options for listing service usage and apollo watchQuery
     */
    private listingOptions = new IncrementSubject();

    constructor(private linkMutationService: NaturalLinkMutationService) {
    }

    @Input() set filters(filters) {
        this.listingOptions.patch({filters: filters});
    }

    ngOnInit() {
    }

    /**
     * Unlink action
     * Refetch result to display it in table
     * Todo : could maybe use "update" attribute of apollo.mutate function to update table faster (but hard to do it here)
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
