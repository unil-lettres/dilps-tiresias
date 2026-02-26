import {Component, inject} from '@angular/core';
import {ChangeService} from '../services/change.service';
import {NaturalAbstractList, TypedMatCellDef} from '@ecodev/natural';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {RouterLink} from '@angular/router';
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
import {DatePipe} from '@angular/common';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
    selector: 'app-changes',
    imports: [
        MatToolbar,
        LogoComponent,
        DatePipe,
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
        RouterLink,
        MatProgressSpinner,
        MatPaginator,
    ],
    templateUrl: './changes.component.html',
    styleUrl: './changes.component.scss',
})
export class ChangesComponent extends NaturalAbstractList<ChangeService> {
    protected displayedColumns = ['type', 'original', 'suggestion', 'owner', 'creationDate'];

    public constructor() {
        super(inject(ChangeService));
    }
}
