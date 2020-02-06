import { Component, Injector } from '@angular/core';
import { AbstractList } from '../../shared/components/AbstractList';
import { Institutions, InstitutionsVariables } from '../../shared/generated-types';
import { InstitutionComponent } from '../institution/institution.component';
import { InstitutionService } from '../services/institution.service';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html',
    styleUrls: ['./institutions.component.scss'],

})
export class InstitutionsComponent extends AbstractList<Institutions['institutions'], InstitutionsVariables> {

    public displayedColumns = ['name', 'locality'];

    constructor(service: InstitutionService, injector: Injector) {
        super(service, InstitutionComponent, injector);
    }

}
