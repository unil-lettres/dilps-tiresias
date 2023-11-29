import {inject, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
    ExtractTallOne,
    NaturalAbstractModelService,
    NaturalAbstractNavigableList,
    NaturalSearchSelections,
    PaginatedData,
    QueryVariables,
} from '@ecodev/natural';
import {ComponentType} from '@angular/cdk/overlay';
import {NavigationExtras} from '@angular/router';

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
        >,
    >
    extends NaturalAbstractNavigableList<TService>
    implements OnInit
{
    public displayedColumns = ['navigation', 'name', 'usageCount'];

    /**
     * If a search has been performed through natural-search component.
     */
    public searched: boolean = false;

    /**
     * Dialog to open detail view
     */
    protected readonly dialog = inject(MatDialog);

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

    public override search(
        naturalSearchSelections: NaturalSearchSelections,
        navigationExtras?: NavigationExtras,
        resetPagination = true,
    ): void {
        super.search(naturalSearchSelections, navigationExtras, resetPagination);
        this.searched = (naturalSearchSelections[0] || []).length > 0;
    }
}
