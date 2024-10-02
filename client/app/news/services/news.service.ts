import {Injectable, inject} from '@angular/core';
import {SITE} from '../../app.config';
import {
    CreateNews,
    CreateNewsVariables,
    DeleteNewses,
    News,
    Newses,
    NewsesVariables,
    NewsInput,
    NewsPartialInput,
    NewsVariables,
    Site,
    UpdateNews,
    UpdateNewsVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {createNews, deleteNewses, newsesQuery, newsQuery, updateNews} from './news.queries';
import {Literal} from '@ecodev/natural';

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
    public constructor() {
        const site = inject<Site>(SITE);

        super('news', newsQuery, newsesQuery, createNews, updateNews, deleteNewses, site);
    }

    public override getDefaultForServer(): NewsInput {
        return {
            name: '',
            description: '',
            file: null,
            site: this.site,
            url: '',
            isActive: false,
        };
    }

    public override getInput(object: Literal, forCreation: boolean): NewsInput | NewsPartialInput {
        const input = super.getInput(object, forCreation);

        // If file is undefined or null, prevent to send attribute to server
        if (!object.file) {
            delete input.file;
        }

        return input;
    }
}
