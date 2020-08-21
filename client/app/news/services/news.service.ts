import {Inject, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {SITE} from '../../app.config';

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
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {createNews, deleteNewses, newsesQuery, newsQuery, updateNews} from './news.queries';

@Injectable({
    providedIn: 'root',
})
export class NewsService extends AbstractContextualizedService<
    News['news'],
    NewsVariables,
    Newses['newses'],
    NewsesVariables,
    CreateNews['createNews'],
    CreateNewsVariables,
    UpdateNews['updateNews'],
    UpdateNewsVariables,
    DeleteNewses['deleteNewses'],
    never
> {
    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo, 'news', newsQuery, newsesQuery, createNews, updateNews, deleteNewses, site);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): NewsInput {
        return {
            name: '',
            description: '',
            file: null,
            site: this.site,
            url: '',
            isActive: false,
        };
    }

    public getInput(object) {
        const input = super.getInput(object);

        // If file is undefined or null, prevent to send attribute to server
        if (!object.file) {
            delete input.file;
        }

        if (input.url === '') {
            delete input.url;
        }

        return input;
    }
}
