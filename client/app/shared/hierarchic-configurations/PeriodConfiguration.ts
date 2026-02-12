import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {PeriodService} from '../../periods/services/period.service';
import {PeriodsQuery} from '../generated-types';
import {formatItemNameWithRoot, formatYearRange} from '../services/utility';

export const periodHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: PeriodService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'period',
        displayWith: (period: PeriodsQuery['periods']['items'][0]): string => {
            return formatItemNameWithRoot(period) + formatYearRange(period.from, period.to);
        },
    },
];
