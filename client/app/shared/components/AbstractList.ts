import {Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
    ExtractTallOne,
    Literal,
    NaturalAbstractList,
    NaturalAbstractModelService,
    PaginatedData,
    QueryVariables,
} from '@ecodev/natural';
import {ComponentType} from '@angular/cdk/overlay';

export class AbstractList<
        TService extends NaturalAbstractModelService<
            any,
            any,
            PaginatedData<Literal>,
            QueryVariables,
            any,
            any,
            any,
            any,
            any,
            any
        >,
    >
    extends NaturalAbstractList<TService>
    implements OnInit
{
    public displayedColumns = ['name'];

    protected dialog: MatDialog;

    public constructor(service: TService, private readonly component: ComponentType<unknown>, injector: Injector) {
        super(service, injector);
        this.dialog = injector.get(MatDialog);
    }

    public edit(item: ExtractTallOne<TService>): void {
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
}
