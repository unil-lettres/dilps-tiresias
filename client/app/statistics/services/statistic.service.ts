import {Apollo} from 'apollo-angular';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {SITE} from '../../app.config';
import {Site, Statistic, Statistics, StatisticsVariables, StatisticVariables} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {recordDetail, recordPage, recordSearch, statisticQuery, statisticsQuery} from './statistic.queries';
import {NaturalDebounceService} from '@ecodev/natural';
import {Observable, Subject, switchMap} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {DocumentNode} from 'graphql';

@Injectable({
    providedIn: 'root',
})
export class StatisticService
    extends AbstractContextualizedService<
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
    >
    implements OnDestroy
{
    private readonly page = new Subject<void>();
    private readonly detail = new Subject<void>();
    private readonly search = new Subject<void>();
    private readonly onDestroy = new Subject<void>();

    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService, @Inject(SITE) site: Site) {
        super(apollo, naturalDebounceService, 'statistic', statisticQuery, statisticsQuery, null, null, null, site);

        this.createSub(this.page, recordPage);
        this.createSub(this.detail, recordDetail);
        this.createSub(this.search, recordSearch);
    }

    /**
     * Create a subscription that will send the mutation with a debounced time
     */
    private createSub(subject: Observable<void>, mutation: DocumentNode): void {
        subject
            .pipe(
                takeUntil(this.onDestroy),
                debounceTime(800),
                switchMap(() =>
                    this.apollo.mutate<unknown, never>({
                        mutation: mutation,
                    }),
                ),
            )
            .subscribe();
    }

    public recordPage(): void {
        this.page.next();
    }

    public recordDetail(): void {
        this.detail.next();
    }

    public recordSearch(): void {
        this.search.next();
    }

    public ngOnDestroy(): void {
        this.onDestroy.next();
        this.onDestroy.complete();
    }
}
