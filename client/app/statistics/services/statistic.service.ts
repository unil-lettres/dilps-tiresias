import {assertInInjectionContext, Inject, Injectable} from '@angular/core';
import {SITE} from '../../app.config';
import {Site, Statistic, Statistics, StatisticsVariables, StatisticVariables} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {recordDetail, recordPage, recordSearch, statisticQuery, statisticsQuery} from './statistic.queries';
import {Observable, Subject, switchMap} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {DocumentNode} from 'graphql';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
    private readonly page = new Subject<void>();
    private readonly detail = new Subject<void>();
    private readonly search = new Subject<void>();

    public constructor(@Inject(SITE) site: Site) {
        super('statistic', statisticQuery, statisticsQuery, null, null, null, site);

        this.createSub(this.page, recordPage);
        this.createSub(this.detail, recordDetail);
        this.createSub(this.search, recordSearch);
    }

    /**
     * Create a subscription that will send the mutation with a debounced time.
     *
     * This method must only be called from an injection context.
     */
    private createSub(subject: Observable<void>, mutation: DocumentNode): void {
        assertInInjectionContext;

        subject
            .pipe(
                takeUntilDestroyed(),
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
}
