import {Injectable} from '@angular/core';
import {
    CreateTag,
    CreateTagVariables,
    DeleteTags,
    Tag,
    TagInput,
    Tags,
    TagsVariables,
    TagVariables,
    UpdateTag,
    UpdateTagVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {createTag, deleteTags, tagQuery, tagsQuery, updateTag} from './tag.queries';

@Injectable({
    providedIn: 'root',
})
export class TagService extends AbstractContextualizedService<
    Tag['tag'],
    TagVariables,
    Tags['tags'],
    TagsVariables,
    CreateTag['createTag'],
    CreateTagVariables,
    UpdateTag['updateTag'],
    UpdateTagVariables,
    DeleteTags['deleteTags'],
    never
> {
    public constructor() {
        super('tag', tagQuery, tagsQuery, createTag, updateTag, deleteTags);
    }

    public override getDefaultForServer(): TagInput {
        return {
            site: this.site,
            name: '',
            parent: null,
        };
    }
}
