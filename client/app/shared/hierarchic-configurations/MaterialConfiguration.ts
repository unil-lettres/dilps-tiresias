import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {MaterialService} from '../../materials/services/material.service';
import {Materials} from '../generated-types';
import {formatItemNameWithRoot} from '../services/utility';

export const materialHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: MaterialService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'material',
        displayWith: formatItemNameWithRoot,
    },
];

export const onlyLeafMaterialHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: MaterialService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'material',
        isSelectableCallback: (item: Materials['materials']['items'][0]) => !item.hasChildren,
        displayWith: formatItemNameWithRoot,
    },
];
