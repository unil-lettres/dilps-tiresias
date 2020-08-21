import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {MaterialService} from '../../materials/services/material.service';
import {Materials_materials_items} from '../generated-types';

export const materialHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: MaterialService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'material',
    },
];

export const onlyLeafMaterialHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: MaterialService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'material',
        isSelectableCallback: (item: Materials_materials_items) => !item.hasChildren,
    },
];
