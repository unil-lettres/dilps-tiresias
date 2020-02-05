import { Component, Injector } from '@angular/core';
import { Sorting, SortingOrder } from '@ecodev/natural';
import { AbstractNavigableList } from '../../shared/components/AbstractNavigableList';
import { Periods, PeriodSortingField, PeriodsVariables } from '../../shared/generated-types';
import { PeriodComponent } from '../period/period.component';
import { PeriodService } from '../services/period.service';

@Component({
    selector: 'app-periods',
    templateUrl: './periods.component.html',
    styleUrls: ['./periods.component.scss'],

})
export class PeriodsComponent extends AbstractNavigableList<Periods['periods'], PeriodsVariables> {

    public displayedColumns = ['navigation', 'name', 'from', 'to'];

    protected defaultSorting: Array<Sorting> = [{field: PeriodSortingField.name, order: SortingOrder.ASC}];

    constructor(service: PeriodService, injector: Injector) {
        super(service, PeriodComponent, injector);
    }

}
