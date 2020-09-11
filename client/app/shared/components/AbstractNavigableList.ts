import {Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NaturalAbstractNavigableList, PaginatedData, QueryVariables} from '@ecodev/natural';

type BreadcrumbItem = {
    id: string;
    name: string;
    parent;
    parentHierarchy;
};

export class AbstractNavigableList<Tall extends PaginatedData<any>, Vall extends QueryVariables>
    extends NaturalAbstractNavigableList<Tall, Vall>
    implements OnInit {
    public displayedColumns = ['navigation', 'name'];

    /**
     * Dialog to open detail view
     */
    protected dialog: MatDialog;

    constructor(public service, private component, injector: Injector) {
        super(service, injector);
        this.dialog = injector.get(MatDialog);
    }

    public edit(item): void {
        this.dialog.open(this.component, {
            width: '800px',
            data: {item: item},
        });
    }

    public add(): void {
        this.dialog.open(this.component, {
            width: '800px',
        });
    }

    protected getBreadcrumb(item: BreadcrumbItem): BreadcrumbItem[] {
        return [...item.parentHierarchy, item];
    }
}
