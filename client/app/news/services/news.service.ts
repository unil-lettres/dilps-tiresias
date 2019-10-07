import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    News,
    Newses,
    NewsesVariables,
    NewsVariables,
    CreateNews,
    CreateNewsVariables,
    DeleteNewses,
    UpdateNews,
    UpdateNewsVariables,
} from '../../shared/generated-types';
import { newsQuery, newsesQuery, createNews, deleteNewses, updateNews } from './news.queries';
import { NaturalAbstractModelService } from '@ecodev/natural';

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

    public getDefaultForServer() {
        return {
            name: '',
        };
    }

}
