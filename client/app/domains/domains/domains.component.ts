import {Component, inject} from '@angular/core';
import {DomainComponent} from '../domain/domain.component';
import {DomainService} from '../services/domain.service';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';
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
import {NaturalSearchComponent, TypedMatCellDef} from '@ecodev/natural';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbar} from '@angular/material/toolbar';
import {CollectionHierarchyComponent} from '../../shared/components/collection-hierarchy/collection-hierarchy.component';
import {NavigableBreadcrumbComponent} from '../../shared/components/navigable-breadcrumb/navigable-breadcrumb.component';

@Component({
    selector: 'app-domains',
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
    templateUrl: './domains.component.html',
    styleUrl: './domains.component.scss',
})
export class DomainsComponent extends AbstractNavigableList<DomainService> {
    public constructor() {
        super(inject(DomainService), DomainComponent);
    }
}
