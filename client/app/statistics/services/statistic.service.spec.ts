import {TestBed} from '@angular/core/testing';
import {Apollo} from 'apollo-angular';
import {of, throwError} from 'rxjs';
import {SITE} from '../../app.config';
import {Site} from '../../shared/generated-types';
import {MOCK_APOLLO_PROVIDER} from '../../shared/testing/MockApolloProvider';
import {StatisticService} from './statistic.service';

describe('StatisticService', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        TestBed.configureTestingModule({
            providers: [MOCK_APOLLO_PROVIDER, {provide: SITE, useValue: Site.Dilps}],
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should keep recording after a statistic was lost', () => {
        const mutate = vi
            .spyOn(TestBed.inject(Apollo), 'mutate')
            .mockReturnValueOnce(throwError(() => new Error('Http failure response for /graphql: 0 undefined')))
            .mockReturnValue(of({data: {recordSearch: true}}));
        const service = TestBed.inject(StatisticService);

        service.recordSearch();
        vi.advanceTimersByTime(800);
        service.recordSearch();
        vi.advanceTimersByTime(800);

        expect(mutate).toHaveBeenCalledTimes(2);
    });
});
