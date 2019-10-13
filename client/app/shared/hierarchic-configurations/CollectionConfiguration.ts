import { NaturalHierarchicConfiguration } from '@ecodev/natural';
import { CollectionService } from '../../collections/services/collection.service';

export const collectionsHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: CollectionService,
        parentsFilters: ['parent'],
        childrenFilters: ['parent'],
        selectableAtKey: 'collection',
    },
];
