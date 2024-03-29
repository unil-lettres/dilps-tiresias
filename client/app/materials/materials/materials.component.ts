import {Component} from '@angular/core';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';
import {MaterialComponent} from '../material/material.component';
import {MaterialService} from '../services/material.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
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
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatToolbarModule} from '@angular/material/toolbar';
import {CollectionHierarchyComponent} from '../../shared/components/collection-hierarchy/collection-hierarchy.component';

@Component({
    selector: 'app-materials',
    templateUrl: './materials.component.html',
    styleUrl: './materials.component.scss',
    standalone: true,
    imports: [
        MatToolbarModule,
        FlexModule,
        LogoComponent,
        NaturalSearchComponent,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        ExtendedModule,
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
export class MaterialsComponent extends AbstractNavigableList<MaterialService> {
    public constructor(service: MaterialService) {
        super(service, MaterialComponent);
    }
}
