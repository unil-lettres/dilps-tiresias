import {Inject, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {SITE} from '../../app.config';

import {
    Statistic,
    Statistics,
    StatisticsVariables,
    StatisticVariables,
    Site,
    RecordPage,
    RecordDetail,
    RecordSearch,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {recordDetail, recordPage, recordSearch, statisticQuery, statisticsQuery} from './statistic.queries';

@Injectable({
    providedIn: 'root',
})
export class StatisticService extends AbstractContextualizedService<
    Statistic['statistic'],
    StatisticVariables,
    Statistics['statistics'],
    StatisticsVariables,
    never,
    never,
    never,
    never,
    never,
    never
> {
    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo, 'statistic', statisticQuery, statisticsQuery, null, null, null, site);
    }

    public recordPage(): void {
        this.apollo
            .mutate<RecordPage>({
                mutation: recordPage,
            })
            .subscribe();
    }

    public recordDetail(): void {
        this.apollo
            .mutate<RecordDetail>({
                mutation: recordDetail,
            })
            .subscribe();
    }

    public recordSearch(): void {
        this.apollo
            .mutate<RecordSearch>({
                mutation: recordSearch,
            })
            .subscribe();
    }
}
