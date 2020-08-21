import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {DomainService} from '../../domains/services/domain.service';

export const domainHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: DomainService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'domain',
    },
];
