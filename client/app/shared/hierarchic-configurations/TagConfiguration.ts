import { NaturalHierarchicConfiguration } from '@ecodev/natural';
import { TagService } from '../../tags/services/tag.service';

export const tagHierarchicConfig: NaturalHierarchicConfiguration[] = [
    {
        service: TagService,
        parentsFilters: ['parent'],
        childrenFilters: ['parent'],
        selectableAtKey: 'tag',
    },
];
