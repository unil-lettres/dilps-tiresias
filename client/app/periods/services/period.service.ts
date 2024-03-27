import {Inject, Injectable} from '@angular/core';
import {
    CreatePeriod,
    CreatePeriodVariables,
    DeletePeriods,
    Period,
    PeriodInput,
    Periods,
    PeriodsVariables,
    PeriodVariables,
    Site,
    UpdatePeriod,
    UpdatePeriodVariables,
} from '../../shared/generated-types';
import {createPeriod, deletePeriods, periodQuery, periodsQuery, updatePeriod} from './period.queries';
import {SITE} from '../../app.config';
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
    public constructor(@Inject(SITE) site: Site) {
        super('period', periodQuery, periodsQuery, createPeriod, updatePeriod, deletePeriods, site);
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
