import { NaturalHierarchicConfiguration } from '@ecodev/natural';
import { PeriodService } from '../../periods/services/period.service';

export const periodHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: PeriodService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'period',
    },
];
