import {ComponentType} from '@angular/cdk/overlay';
import {inject, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
    ExtractTallOne,
    Literal,
    NaturalAbstractList,
    NaturalAbstractModelService,
    PaginatedData,
    QueryVariables,
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
            data: {item: {canDelete: true, ...item}},
        });
    }

    public add(): void {
        this.dialog.open(this.component, {
            width: '800px',
        });
    }
}
