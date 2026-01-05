import {Injectable} from '@angular/core';
import {
    CreateTag,
    CreateTagVariables,
    DeleteTags,
    TagQuery,
    TagInput,
    TagsQuery,
    TagsQueryVariables,
    TagQueryVariables,
    UpdateTag,
    UpdateTagVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {createTag, deleteTags, tagQuery, tagsQuery, updateTag} from './tag.queries';

@Injectable({
    providedIn: 'root',
})
export class TagService extends AbstractContextualizedService<
    TagQuery['tag'],
    TagQueryVariables,
    TagsQuery['tags'],
    TagsQueryVariables,
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
