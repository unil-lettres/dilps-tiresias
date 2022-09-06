import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {SITE} from '../../app.config';
import {
    RecordDetail,
    RecordPage,
    RecordSearch,
    Site,
    Statistic,
    Statistics,
    StatisticsVariables,
    StatisticVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {recordDetail, recordPage, recordSearch, statisticQuery, statisticsQuery} from './statistic.queries';
import {NaturalDebounceService} from '@ecodev/natural';

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
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService, @Inject(SITE) site: Site) {
        super(apollo, naturalDebounceService, 'statistic', statisticQuery, statisticsQuery, null, null, null, site);
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
