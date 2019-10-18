import { Component, Injector } from '@angular/core';
import { AbstractNavigableList } from '../../shared/components/AbstractNavigableList';
import { Periods, PeriodsVariables } from '../../shared/generated-types';
import { PeriodComponent } from '../period/period.component';
import { PeriodService } from '../services/period.service';

@Component({
    selector: 'app-periods',
    templateUrl: './periods.component.html',
    styleUrls: ['./periods.component.scss'],

})
export class PeriodsComponent extends AbstractNavigableList<Periods['periods'], PeriodsVariables> {

    public displayedColumns = ['name', 'from', 'to'];

    constructor(service: PeriodService, injector: Injector) {
        super(service, PeriodComponent, injector);
    }

}
