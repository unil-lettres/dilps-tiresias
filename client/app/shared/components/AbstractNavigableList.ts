import { Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NaturalAbstractNavigableList, PaginatedData, QueryVariables } from '@ecodev/natural';

export class AbstractNavigableList<Tall extends PaginatedData<any>, Vall extends QueryVariables>
    extends NaturalAbstractNavigableList<Tall, Vall>
    implements OnInit {

    public displayedColumns = [
        'navigation',
        'name',
    ];

    /**
     * Dialog to open detail view
     */
    protected dialog: MatDialog;

    constructor(protected service,
                private component,
                injector: Injector) {

        super(service, injector);

        this.dialog = injector.get(MatDialog);
    }

    public edit(item) {
        this.dialog.open(this.component, {
            width: '800px',
            data: {item: item},
        });
    }

    public add() {
        this.dialog.open(this.component, {
            width: '800px',
        });
    }

    protected getBreadcrumb(item: { parent, name, parentHierarchy }): { name }[] {
        return [...item.parentHierarchy, item];
    }
}
