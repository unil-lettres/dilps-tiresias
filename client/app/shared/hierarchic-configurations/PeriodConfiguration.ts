import { NaturalHierarchicConfiguration } from '@ecodev/natural';
import { PeriodService } from '../../periods/services/period.service';
import { Periods_periods_items } from '../generated-types';
import { formatYearRange } from '../services/utility';

export const periodHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: PeriodService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'period',
        displayWith: (period: Periods_periods_items) => {
            console.log(period);

            return period.name + formatYearRange(period.from, period.to);
        },
    },
];
