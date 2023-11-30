import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {TagService} from '../../tags/services/tag.service';
import {Tags} from '../generated-types';
import {formatItemNameWithRoot} from '../services/utility';

export const tagHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: TagService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'tag',
        displayWith: formatItemNameWithRoot,
    },
];

export const onlyLeafTagHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: TagService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'tag',
        isSelectableCallback: (item: Tags['tags']['items'][0]) => !item.hasChildren,
        displayWith: formatItemNameWithRoot,
    },
];
