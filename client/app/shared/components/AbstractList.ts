import {type ComponentType} from '@angular/cdk/overlay';
import {inject, type OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
    type ExtractTallOne,
    type Literal,
    NaturalAbstractList,
    type NaturalAbstractModelService,
    type PaginatedData,
    type QueryVariables,
} from '@ecodev/natural';

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
    public displayedColumns = ['name', 'usageCount'];

    protected readonly dialog: MatDialog = inject(MatDialog);

    public constructor(
        service: TService,
        private readonly component: ComponentType<unknown>,
    ) {
        super(service);
    }

    public edit(item: ExtractTallOne<TService>): void {
        this.dialog.open(this.component, {
            width: '800px',
            data: {item: {readOnly: false, ...item}},
        });
    }

    public add(): void {
        this.dialog.open(this.component, {
            width: '800px',
            data: {item: {readOnly: false}},
        });
    }
}
