import {Component, inject} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {AntiqueNameComponent} from '../antique-name/antique-name.component';
import {AntiqueNameService} from '../services/antique-name.service';
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
    selector: 'app-antique-names',
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
    templateUrl: './antique-names.component.html',
    styleUrl: './antique-names.component.scss',
})
export class AntiqueNamesComponent extends AbstractList<AntiqueNameService> {
    public constructor() {
        super(inject(AntiqueNameService), AntiqueNameComponent);
    }
}
