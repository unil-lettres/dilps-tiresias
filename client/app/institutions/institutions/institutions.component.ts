import {Component, inject} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {InstitutionComponent} from '../institution/institution.component';
import {InstitutionService} from '../services/institution.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton} from '@angular/material/button';
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
    selector: 'app-institutions',
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
        MatButton,
        MatIcon,
    ],
    templateUrl: './institutions.component.html',
    styleUrl: './institutions.component.scss',
})
export class InstitutionsComponent extends AbstractList<InstitutionService> {
    public override displayedColumns = ['name', 'locality', 'usageCount'];

    public constructor() {
        super(inject(InstitutionService), InstitutionComponent);
    }
}
