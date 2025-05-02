import {Component, inject} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {InstitutionComponent} from '../institution/institution.component';
import {InstitutionService} from '../services/institution.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {NaturalFixedButtonComponent, NaturalSearchComponent} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html',
    styleUrl: './institutions.component.scss',
    imports: [
        MatToolbarModule,
        LogoComponent,
        NaturalSearchComponent,
        MatTableModule,
        MatSortModule,
        TableButtonComponent,
        MatTooltipModule,
        HideTooltipDirective,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalFixedButtonComponent,
    ],
})
export class InstitutionsComponent extends AbstractList<InstitutionService> {
    public override displayedColumns = ['name', 'locality', 'usageCount'];

    public constructor() {
        super(inject(InstitutionService), InstitutionComponent);
    }
}
