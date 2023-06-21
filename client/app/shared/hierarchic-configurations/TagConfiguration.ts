import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {TagService} from '../../tags/services/tag.service';
import {Tags} from '../generated-types';

export const tagHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: TagService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'tag',
    },
];

export const onlyLeafTagHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: TagService,
        parentsRelationNames: ['parent'],
        childrenRelationNames: ['parent'],
        selectableAtKey: 'tag',
        isSelectableCallback: (item: Tags['tags']['items'][0]) => !item.hasChildren,
    },
];
