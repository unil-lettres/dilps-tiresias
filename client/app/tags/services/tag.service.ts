import { Inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SITE } from '../../app.config';

import {
    CreateTag,
    CreateTagVariables,
    DeleteTags,
    Site,
    Tag,
    Tags,
    TagsVariables,
    TagVariables,
    UpdateTag,
    UpdateTagVariables,
} from '../../shared/generated-types';
import { AbstractContextualizedService } from '../../shared/services/AbstractContextualizedService';
import { createTag, deleteTags, tagQuery, tagsQuery, updateTag } from './tag.queries';

@Injectable({
    providedIn: 'root',
})
export class TagService
    extends AbstractContextualizedService<Tag['tag'],
        TagVariables,
        Tags['tags'],
        TagsVariables,
        CreateTag['createTag'],
        CreateTagVariables,
        UpdateTag['updateTag'],
        UpdateTagVariables,
        DeleteTags['deleteTags']> {

    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo,
            'tag',
            tagQuery,
            tagsQuery,
            createTag,
            updateTag,
            deleteTags,
            site);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            name: '',
            parent: null,
        };
    }

}
