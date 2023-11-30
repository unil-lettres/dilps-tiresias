import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {PeriodService} from '../../periods/services/period.service';
import {Periods} from '../generated-types';
import {formatYearRange, formatItemNameWithRoot} from '../services/utility';

export const periodHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: PeriodService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'period',
        displayWith: (period: Periods['periods']['items'][0]): string => {
            return formatItemNameWithRoot(period) + formatYearRange(period.from, period.to);
        },
    },
];
