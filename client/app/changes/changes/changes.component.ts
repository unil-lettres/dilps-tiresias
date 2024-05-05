import {Component} from '@angular/core';
import {ChangeService} from '../services/change.service';
import {NaturalAbstractList} from '@ecodev/natural';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterLink} from '@angular/router';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

import {CommonModule} from '@angular/common';
import {LogoComponent} from '../../shared/components/logo/logo.component';

import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-changes',
    templateUrl: './changes.component.html',
    styleUrl: './changes.component.scss',
    standalone: true,
    imports: [
        MatToolbarModule,

        LogoComponent,
        CommonModule,

        MatTableModule,
        MatSortModule,
        RouterLink,
        MatProgressSpinnerModule,
        MatPaginatorModule,
    ],
})
export class ChangesComponent extends NaturalAbstractList<ChangeService> {
    public displayedColumns = ['type', 'original', 'suggestion', 'owner', 'creationDate'];

    public constructor(service: ChangeService) {
        super(service);
    }
}
