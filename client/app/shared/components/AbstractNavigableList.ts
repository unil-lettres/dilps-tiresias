import {Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
    ExtractTallOne,
    NaturalAbstractModelService,
    NaturalAbstractNavigableList,
    PaginatedData,
    QueryVariables,
} from '@ecodev/natural';
import {ComponentType} from '@angular/cdk/overlay';

type BreadcrumbItem = {
    id: string;
    name: string;
};

export class AbstractNavigableList<
        TService extends NaturalAbstractModelService<
            any,
            any,
            PaginatedData<BreadcrumbItem>,
            QueryVariables,
            any,
            any,
            any,
            any,
            any,
            any
        >
    >
    extends NaturalAbstractNavigableList<TService>
    implements OnInit {
    public displayedColumns = ['navigation', 'name'];

    /**
     * Dialog to open detail view
     */
    protected dialog: MatDialog;

    constructor(
        public readonly service: TService,
        private readonly component: ComponentType<unknown>,
        injector: Injector,
    ) {
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
