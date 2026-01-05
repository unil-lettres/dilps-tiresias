import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {TagService} from '../../tags/services/tag.service';
import {TagsQuery} from '../generated-types';
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
        isSelectableCallback: (item: TagsQuery['tags']['items'][0]) => !item.hasChildren,
        displayWith: formatItemNameWithRoot,
    },
];
