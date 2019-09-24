import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractList } from '../../shared/components/AbstractList';
import { InstitutionComponent } from '../institution/institution.component';
import { InstitutionService } from '../services/institution.service';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html',
    styleUrls: ['./institutions.component.scss'],

})
export class InstitutionsComponent extends AbstractList {

    public displayedColumns = [
        'name',
        'locality',
    ];

    constructor(service: InstitutionService,
                router: Router,
                route: ActivatedRoute,
                dialog: MatDialog) {

        super('institutions', service, InstitutionComponent, router, route, dialog);
    }

}
