import { Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NaturalAbstractList, PaginatedData, QueryVariables } from '@ecodev/natural';

export class AbstractList<Tall extends PaginatedData<any>, Vall extends QueryVariables> extends NaturalAbstractList<Tall, Vall>
    implements OnInit {

    public displayedColumns = ['name'];

    protected dialog: MatDialog;

    constructor(service, private component, injector: Injector) {
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
}
