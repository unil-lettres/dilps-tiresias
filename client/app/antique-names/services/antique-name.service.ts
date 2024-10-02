import {Injectable, inject} from '@angular/core';
import {
    AntiqueName,
    AntiqueNameInput,
    AntiqueNames,
    AntiqueNamesVariables,
    AntiqueNameVariables,
    CreateAntiqueName,
    CreateAntiqueNameVariables,
    DeleteAntiqueNames,
    Site,
    UpdateAntiqueName,
    UpdateAntiqueNameVariables,
} from '../../shared/generated-types';
import {
    antiqueNameQuery,
    antiqueNamesQuery,
    createAntiqueName,
    deleteAntiqueNames,
    updateAntiqueName,
} from './antique-name.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {SITE} from '../../app.config';

@Injectable({
    providedIn: 'root',
})
export class AntiqueNameService extends AbstractContextualizedService<
    AntiqueName['antiqueName'],
    AntiqueNameVariables,
    AntiqueNames['antiqueNames'],
    AntiqueNamesVariables,
    CreateAntiqueName['createAntiqueName'],
    CreateAntiqueNameVariables,
    UpdateAntiqueName['updateAntiqueName'],
    UpdateAntiqueNameVariables,
    DeleteAntiqueNames['deleteAntiqueNames'],
    never
> {
    public constructor() {
        const site = inject<Site>(SITE);

        super(
            'antiqueName',
            antiqueNameQuery,
            antiqueNamesQuery,
            createAntiqueName,
            updateAntiqueName,
            deleteAntiqueNames,
            site,
        );
    }

    public override getDefaultForServer(): AntiqueNameInput {
        return {
            name: '',
            site: this.site,
        };
    }
}
