import { Injectable, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    CreatePeriod,
    CreatePeriodVariables,
    DeletePeriods,
    Period, PeriodInput,
    Periods,
    PeriodsVariables,
    PeriodVariables, Site,
    UpdatePeriod,
    UpdatePeriodVariables,
} from '../../shared/generated-types';
import { createPeriod, deletePeriods, periodQuery, periodsQuery, updatePeriod } from './period.queries';
import { SITE } from '../../app.config';
import { AbstractContextualizedService } from '../../shared/services/AbstractContextualizedService';

@Injectable({
    providedIn: 'root',
})
export class PeriodService
    extends AbstractContextualizedService<Period['period'],
        PeriodVariables,
        Periods['periods'],
        PeriodsVariables,
        CreatePeriod['createPeriod'],
        CreatePeriodVariables,
        UpdatePeriod['updatePeriod'],
        UpdatePeriodVariables,
        DeletePeriods['deletePeriods'],
        never> {

    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo,
            'period',
            periodQuery,
            periodsQuery,
            createPeriod,
            updatePeriod,
            deletePeriods,
            site);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): PeriodInput {
        return {
            name: '',
            parent: null,
            from: null,
            to: null,
            site: this.site,
        };
    }

}
