import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {CollectionService} from '../../collections/services/collection.service';
import {formatItemNameWithRoot} from '../services/utility';

export const collectionsHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: CollectionService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'collection',
        displayWith: formatItemNameWithRoot,
    },
];
