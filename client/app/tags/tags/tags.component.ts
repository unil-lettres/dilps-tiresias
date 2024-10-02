import {Component, inject} from '@angular/core';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';
import {TagService} from '../services/tag.service';
import {TagComponent} from '../tag/tag.component';
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
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrl: './tags.component.scss',
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
export class TagsComponent extends AbstractNavigableList<TagService> {
    public constructor() {
        const service = inject(TagService);

        super(service, TagComponent);
    }
}
