import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';

import {
    CreateNews,
    CreateNewsVariables,
    DeleteNewses,
    News,
    Newses,
    NewsesVariables,
    NewsInput,
    NewsVariables,
    Site,
    UpdateNews,
    UpdateNewsVariables,
} from '../../shared/generated-types';
import { createNews, deleteNewses, newsesQuery, newsQuery, updateNews } from './news.queries';

@Injectable({
    providedIn: 'root',
})
export class NewsService
    extends NaturalAbstractModelService<News['news'],
        NewsVariables,
        Newses['newses'],
        NewsesVariables,
        CreateNews['createNews'],
        CreateNewsVariables,
        UpdateNews['updateNews'],
        UpdateNewsVariables,
        DeleteNewses['deleteNewses']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'news',
            newsQuery,
            newsesQuery,
            createNews,
            updateNews,
            deleteNewses);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): NewsInput {
        return {
            name: '',
            description: '',
            file: null,
            site: Site.dilps,
            url: '',
        };
    }

    public getInput(object) {

        const input = super.getInput(object);

        // If file is undefined or null, prevent to send attribute to server
        if (!object.file) {
            delete input.file;
        }

        return input;
    }

}
