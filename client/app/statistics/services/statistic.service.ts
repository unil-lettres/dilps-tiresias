import {DestroyRef, inject, Injectable} from '@angular/core';
import {
    type Exact,
    type StatisticQuery,
    type StatisticQueryVariables,
    type StatisticsQuery,
    type StatisticsQueryVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {recordDetail, recordPage, recordSearch, statisticQuery, statisticsQuery} from './statistic.queries';
import {type Observable, Subject, switchMap} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {type DocumentNode} from 'graphql';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class StatisticService extends AbstractContextualizedService<
    StatisticQuery['statistic'],
    StatisticQueryVariables,
    StatisticsQuery['statistics'],
    StatisticsQueryVariables,
    never,
    never,
    never,
    never,
    never,
    never
> {
    private readonly destroyRef = inject(DestroyRef);
    private readonly page = new Subject<void>();
    private readonly detail = new Subject<void>();
    private readonly search = new Subject<void>();

    public constructor() {
        super('statistic', statisticQuery, statisticsQuery, null, null, null);

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
        subject
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                debounceTime(800),
                switchMap(() =>
                    this.apollo.mutate<unknown, Exact<Record<string, never>>>({
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
