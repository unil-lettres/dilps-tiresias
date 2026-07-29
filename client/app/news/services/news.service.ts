import {Injectable} from '@angular/core';
import {
    type CreateNews,
    type CreateNewsVariables,
    type DeleteNewses,
    type NewsQuery,
    type NewsesQuery,
    type NewsesQueryVariables,
    type NewsInput,
    type NewsPartialInput,
    type NewsQueryVariables,
    type UpdateNews,
    type UpdateNewsVariables,
    type DeleteNewsesVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {createNews, deleteNewses, newsesQuery, newsQuery, updateNews} from './news.queries';
import {type Literal} from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class NewsService extends AbstractContextualizedService<
    NewsQuery['news'],
    NewsQueryVariables,
    NewsesQuery['newses'],
    NewsesQueryVariables,
    CreateNews['createNews'],
    CreateNewsVariables,
    UpdateNews['updateNews'],
    UpdateNewsVariables,
    DeleteNewses['deleteNewses'],
    DeleteNewsesVariables
> {
    public constructor() {
        super('news', newsQuery, newsesQuery, createNews, updateNews, deleteNewses);
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
