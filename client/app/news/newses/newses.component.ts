import {Component, inject} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {NewsComponent} from '../news/news.component';
import {NewsService} from '../services/news.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltip} from '@angular/material/tooltip';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {MatIcon} from '@angular/material/icon';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
} from '@angular/material/table';
import {NaturalFixedButtonComponent, NaturalSearchComponent} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
    selector: 'app-newses',
    imports: [
        MatToolbar,
        LogoComponent,
        NaturalSearchComponent,
        MatTable,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatColumnDef,
        MatCellDef,
        MatRowDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatSort,
        MatSortHeader,
        MatIcon,
        TableButtonComponent,
        MatTooltip,
        HideTooltipDirective,
        MatProgressSpinner,
        MatPaginator,
        NaturalFixedButtonComponent,
    ],
    templateUrl: './newses.component.html',
    styleUrl: './newses.component.scss',
})
export class NewsesComponent extends AbstractList<NewsService> {
    public override displayedColumns = ['isActive', 'image', 'name', 'url'];

    public constructor() {
        super(inject(NewsService), NewsComponent);
    }
}
