import { NaturalHierarchicConfiguration } from '@ecodev/natural';
import { MaterialService } from '../../materials/services/material.service';

export const materialHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: MaterialService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'material',
    },
];
