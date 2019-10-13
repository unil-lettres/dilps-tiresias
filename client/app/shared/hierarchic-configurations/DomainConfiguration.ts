import { NaturalHierarchicConfiguration } from '@ecodev/natural';
import { DomainService } from '../../domains/services/domain.service';

export const domainHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: DomainService,
        parentsFilters: ['parent'],
        childrenFilters: ['parent'],
        selectableAtKey: 'domain',
    },
];
