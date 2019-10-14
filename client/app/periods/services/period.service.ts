import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';

import {
    CreatePeriod,
    CreatePeriodVariables,
    DeletePeriods,
    Period,
    Periods,
    PeriodsVariables,
    PeriodVariables,
    UpdatePeriod,
    UpdatePeriodVariables,
} from '../../shared/generated-types';
import { createPeriod, deletePeriods, periodQuery, periodsQuery, updatePeriod } from './period.queries';

@Injectable({
    providedIn: 'root',
})
export class PeriodService
    extends NaturalAbstractModelService<Period['period'],
        PeriodVariables,
        Periods['periods'],
        PeriodsVariables,
        CreatePeriod['createPeriod'],
        CreatePeriodVariables,
        UpdatePeriod['updatePeriod'],
        UpdatePeriodVariables,
        DeletePeriods['deletePeriods']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'period',
            periodQuery,
            periodsQuery,
            createPeriod,
            updatePeriod,
            deletePeriods);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            name: '',
            parent: null,
        };
    }

}
