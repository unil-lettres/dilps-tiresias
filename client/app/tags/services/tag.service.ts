import {NaturalDebounceService} from '@ecodev/natural';
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
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService, @Inject(SITE) site: Site) {
        super(apollo, naturalDebounceService, 'tag', tagQuery, tagsQuery, createTag, updateTag, deleteTags, site);
    }

    protected override getDefaultForClient(): TagInput {
        return this.getDefaultForServer();
    }

    protected override getDefaultForServer(): TagInput {
        return {
            site: this.site,
            name: '',
            parent: null,
        };
    }
}
