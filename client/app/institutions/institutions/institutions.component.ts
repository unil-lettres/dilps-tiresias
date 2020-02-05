import { Component, Injector } from '@angular/core';
import { Sorting, SortingOrder } from '@ecodev/natural';
import { AbstractList } from '../../shared/components/AbstractList';
import { Institutions, InstitutionSortingField, InstitutionsVariables } from '../../shared/generated-types';
import { InstitutionComponent } from '../institution/institution.component';
import { InstitutionService } from '../services/institution.service';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html',
    styleUrls: ['./institutions.component.scss'],

})
export class InstitutionsComponent extends AbstractList<Institutions['institutions'], InstitutionsVariables> {

    public displayedColumns = ['name', 'locality'];

    protected defaultSorting: Array<Sorting> = [{field: InstitutionSortingField.name, order: SortingOrder.ASC}];

    constructor(service: InstitutionService, injector: Injector) {
        super(service, InstitutionComponent, injector);
    }

}
