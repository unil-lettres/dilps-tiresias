import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {DocumentTypeComponent} from '../document-type/document-type.component';
import {DocumentTypeService} from '../services/document-type.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {CreateButtonComponent} from '../../shared/components/create-button/create-button.component';
import {MatIcon} from '@angular/material/icon';
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
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
    selector: 'app-document-types',
    imports: [
        MatToolbar,
        LogoComponent,
        NaturalSearchComponent,
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
        MatProgressSpinner,
        MatPaginator,
        MatIcon,
        CreateButtonComponent,
    ],
    templateUrl: './document-types.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {class: 'toolbar-page'},
})
export class DocumentTypesComponent extends AbstractList<DocumentTypeService> {
    public constructor() {
        super(inject(DocumentTypeService), DocumentTypeComponent);
    }
}
