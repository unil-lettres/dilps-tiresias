import {Injectable} from '@angular/core';
import {
    CreatePeriod,
    CreatePeriodVariables,
    DeletePeriods,
    Period,
    PeriodInput,
    Periods,
    PeriodsVariables,
    PeriodVariables,
    UpdatePeriod,
    UpdatePeriodVariables,
} from '../../shared/generated-types';
import {createPeriod, deletePeriods, periodQuery, periodsQuery, updatePeriod} from './period.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

@Injectable({
    providedIn: 'root',
})
export class PeriodService extends AbstractContextualizedService<
    Period['period'],
    PeriodVariables,
    Periods['periods'],
    PeriodsVariables,
    CreatePeriod['createPeriod'],
    CreatePeriodVariables,
    UpdatePeriod['updatePeriod'],
    UpdatePeriodVariables,
    DeletePeriods['deletePeriods'],
    never
> {
    public constructor() {
        super('period', periodQuery, periodsQuery, createPeriod, updatePeriod, deletePeriods);
    }

    public override getDefaultForServer(): PeriodInput {
        return {
            name: '',
            parent: null,
            from: null,
            to: null,
            site: this.site,
        };
    }
}
