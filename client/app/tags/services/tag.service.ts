import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    Tag,
    Tags,
    TagsVariables,
    TagVariables,
    CreateTag,
    CreateTagVariables,
    DeleteTags,
    UpdateTag,
    UpdateTagVariables,
} from '../../shared/generated-types';
import { tagQuery, tagsQuery, createTag, deleteTags, updateTag } from './tag.queries';
import { NaturalAbstractModelService } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class TagService
    extends NaturalAbstractModelService<Tag['tag'],
        TagVariables,
        Tags['tags'],
        TagsVariables,
        CreateTag['createTag'],
        CreateTagVariables,
        UpdateTag['updateTag'],
        UpdateTagVariables,
        DeleteTags['deleteTags']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'tag',
            tagQuery,
            tagsQuery,
            createTag,
            updateTag,
            deleteTags);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            name: '',
            parent: null
        };
    }

}
