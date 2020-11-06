import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {SITE} from '../../app.config';
import {
    CreateTag,
    CreateTagVariables,
    DeleteTags,
    Site,
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
    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo, 'tag', tagQuery, tagsQuery, createTag, updateTag, deleteTags, site);
    }

    public getDefaultForClient(): TagInput {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): TagInput {
        return {
            site: this.site,
            name: '',
            parent: null,
        };
    }
}
