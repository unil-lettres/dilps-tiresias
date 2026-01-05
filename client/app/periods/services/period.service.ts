import {Injectable} from '@angular/core';
import {
    CreatePeriod,
    CreatePeriodVariables,
    DeletePeriods,
    PeriodQuery,
    PeriodInput,
    PeriodsQuery,
    PeriodsQueryVariables,
    PeriodQueryVariables,
    UpdatePeriod,
    UpdatePeriodVariables,
} from '../../shared/generated-types';
import {createPeriod, deletePeriods, periodQuery, periodsQuery, updatePeriod} from './period.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

@Injectable({
    providedIn: 'root',
})
export class PeriodService extends AbstractContextualizedService<
    PeriodQuery['period'],
    PeriodQueryVariables,
    PeriodsQuery['periods'],
    PeriodsQueryVariables,
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
