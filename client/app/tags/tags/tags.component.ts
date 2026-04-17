import {Component, inject} from '@angular/core';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';
import {TagService} from '../services/tag.service';
import {TagComponent} from '../tag/tag.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
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
import {MatButton} from '@angular/material/button';
import {NaturalSearchComponent, NaturalTableButtonComponent, TypedMatCellDef} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbar} from '@angular/material/toolbar';
import {CollectionHierarchyComponent} from '../../shared/components/collection-hierarchy/collection-hierarchy.component';
import {NavigableBreadcrumbComponent} from '../../shared/components/navigable-breadcrumb/navigable-breadcrumb.component';

@Component({
    selector: 'app-tags',
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
        NaturalTableButtonComponent,
        MatTooltip,
        HideTooltipDirective,
        TableButtonComponent,
        MatProgressSpinner,
        MatPaginator,
        CollectionHierarchyComponent,
        NavigableBreadcrumbComponent,
    ],
    templateUrl: './tags.component.html',
    styleUrl: './tags.component.scss',
})
export class TagsComponent extends AbstractNavigableList<TagService> {
    public constructor() {
        super(inject(TagService), TagComponent);
    }
}
