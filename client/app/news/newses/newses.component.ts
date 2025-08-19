import {Component, inject} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {NewsComponent} from '../news/news.component';
import {NewsService} from '../services/news.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {NaturalFixedButtonComponent, NaturalSearchComponent} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-newses',
    templateUrl: './newses.component.html',
    styleUrl: './newses.component.scss',
    imports: [
        MatToolbarModule,
        LogoComponent,
        NaturalSearchComponent,
        MatTableModule,
        MatSortModule,
        MatIconModule,
        TableButtonComponent,
        MatTooltipModule,
        HideTooltipDirective,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalFixedButtonComponent,
    ],
})
export class NewsesComponent extends AbstractList<NewsService> {
    public override displayedColumns = ['isActive', 'image', 'name', 'url'];

    public constructor() {
        super(inject(NewsService), NewsComponent);
    }
}
