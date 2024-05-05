import {Component} from '@angular/core';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';
import {PeriodComponent} from '../period/period.component';
import {PeriodService} from '../services/period.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {
    NaturalSearchComponent,
    NaturalTableButtonComponent,
    NaturalFixedButtonComponent,
    NaturalIconDirective,
} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {CollectionHierarchyComponent} from '../../shared/components/collection-hierarchy/collection-hierarchy.component';

@Component({
    selector: 'app-periods',
    templateUrl: './periods.component.html',
    styleUrl: './periods.component.scss',
    standalone: true,
    imports: [
        MatToolbarModule,

        LogoComponent,
        NaturalSearchComponent,
        RouterLink,
        MatButtonModule,
        MatIconModule,

        MatTableModule,
        MatSortModule,
        NaturalTableButtonComponent,
        MatTooltipModule,
        HideTooltipDirective,
        TableButtonComponent,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalFixedButtonComponent,
        NaturalIconDirective,
        CollectionHierarchyComponent,
    ],
})
export class PeriodsComponent extends AbstractNavigableList<PeriodService> {
    public override displayedColumns = ['navigation', 'name', 'from', 'to', 'usageCount'];

    public constructor(service: PeriodService) {
        super(service, PeriodComponent);
    }
}
