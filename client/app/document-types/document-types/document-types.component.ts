import {Component} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {DocumentTypeComponent} from '../document-type/document-type.component';
import {DocumentTypeService} from '../services/document-type.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

import {NaturalSearchComponent, NaturalFixedButtonComponent} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';

import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-document-types',
    templateUrl: './document-types.component.html',
    styleUrl: './document-types.component.scss',
    standalone: true,
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
export class DocumentTypesComponent extends AbstractList<DocumentTypeService> {
    public constructor(service: DocumentTypeService) {
        super(service, DocumentTypeComponent);
    }
}
