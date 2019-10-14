import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    Period,
    Periods,
    PeriodsVariables,
    PeriodVariables,
    CreatePeriod,
    CreatePeriodVariables,
    DeletePeriods,
    UpdatePeriod,
    UpdatePeriodVariables,
} from '../../shared/generated-types';
import { periodQuery, periodsQuery, createPeriod, deletePeriods, updatePeriod } from './period.queries';
import { NaturalAbstractModelService } from '@ecodev/natural';

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
            parent: null
        };
    }

}
