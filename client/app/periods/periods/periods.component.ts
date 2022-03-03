import {Component, Injector} from '@angular/core';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';
import {PeriodComponent} from '../period/period.component';
import {PeriodService} from '../services/period.service';

@Component({
    selector: 'app-periods',
    templateUrl: './periods.component.html',
    styleUrls: ['./periods.component.scss'],
})
export class PeriodsComponent extends AbstractNavigableList<PeriodService> {
    public displayedColumns = ['navigation', 'name', 'from', 'to'];

    public constructor(service: PeriodService, injector: Injector) {
        super(service, PeriodComponent, injector);
    }
}
