import {Component, inject} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {AntiqueNameComponent} from '../antique-name/antique-name.component';
import {AntiqueNameService} from '../services/antique-name.service';
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
    selector: 'app-antique-names',
    templateUrl: './antique-names.component.html',
    styleUrl: './antique-names.component.scss',
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
export class AntiqueNamesComponent extends AbstractList<AntiqueNameService> {
    public constructor() {
        super(inject(AntiqueNameService), AntiqueNameComponent);
    }
}
