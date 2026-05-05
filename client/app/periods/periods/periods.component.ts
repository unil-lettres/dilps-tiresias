import {Component, inject} from '@angular/core';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';
import {PeriodComponent} from '../period/period.component';
import {PeriodService} from '../services/period.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NaturalSearchComponent, TypedMatCellDef} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbar} from '@angular/material/toolbar';
import {CollectionHierarchyComponent} from '../../shared/components/collection-hierarchy/collection-hierarchy.component';
import {NavigableBreadcrumbComponent} from '../../shared/components/navigable-breadcrumb/navigable-breadcrumb.component';

@Component({
    selector: 'app-periods',
    imports: [
        MatToolbar,
        LogoComponent,
        NaturalSearchComponent,
        MatButton,
        MatIcon,
        MatTable,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatColumnDef,
        TypedMatCellDef,
        MatRowDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatSort,
        MatSortHeader,
        MatIconButton,
        RouterLink,
        MatTooltip,
        HideTooltipDirective,
        MatProgressSpinner,
        MatPaginator,
        CollectionHierarchyComponent,
        NavigableBreadcrumbComponent,
    ],
    templateUrl: './periods.component.html',
    styleUrl: './periods.component.scss',
})
export class PeriodsComponent extends AbstractNavigableList<PeriodService> {
    public override displayedColumns = ['navigation', 'name', 'from', 'to', 'usageCount'];

    public constructor() {
        super(inject(PeriodService), PeriodComponent);
    }
}
