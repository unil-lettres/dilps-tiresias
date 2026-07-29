import {Injectable} from '@angular/core';
import {
    type CreatePeriod,
    type CreatePeriodVariables,
    type DeletePeriods,
    type PeriodQuery,
    type PeriodInput,
    type PeriodsQuery,
    type PeriodsQueryVariables,
    type PeriodQueryVariables,
    type UpdatePeriod,
    type UpdatePeriodVariables,
    type DeletePeriodsVariables,
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
    DeletePeriodsVariables
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
