import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {DomainService} from '../../domains/services/domain.service';
import {formatItemNameWithRoot} from '../services/utility';

export const domainHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: DomainService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'domain',
        displayWith: formatItemNameWithRoot,
    },
];
