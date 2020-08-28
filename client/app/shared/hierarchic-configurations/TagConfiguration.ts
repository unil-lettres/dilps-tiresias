import {NaturalHierarchicConfiguration} from '@ecodev/natural';
import {TagService} from '../../tags/services/tag.service';
import {Tags_tags_items} from '../generated-types';

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
        isSelectableCallback: (item: Tags_tags_items) => !item.hasChildren,
    },
];
