import { Injectable, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    AntiqueName,
    AntiqueNameInput,
    AntiqueNames,
    AntiqueNamesVariables,
    AntiqueNameVariables,
    CreateAntiqueName,
    CreateAntiqueNameVariables,
    DeleteAntiqueNames, Site,
    UpdateAntiqueName,
    UpdateAntiqueNameVariables,
} from '../../shared/generated-types';
import { antiqueNameQuery, antiqueNamesQuery, createAntiqueName, deleteAntiqueNames, updateAntiqueName } from './antique-name.queries';
import { AbstractContextualizedService } from '../../shared/services/AbstractContextualizedService';
import { SITE } from '../../app.config';

@Injectable({
    providedIn: 'root',
})
export class AntiqueNameService
    extends AbstractContextualizedService<AntiqueName['antiqueName'],
        AntiqueNameVariables,
        AntiqueNames['antiqueNames'],
        AntiqueNamesVariables,
        CreateAntiqueName['createAntiqueName'],
        CreateAntiqueNameVariables,
        UpdateAntiqueName['updateAntiqueName'],
        UpdateAntiqueNameVariables,
        DeleteAntiqueNames['deleteAntiqueNames'],
        never> {

    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo,
            'antiqueName',
            antiqueNameQuery,
            antiqueNamesQuery,
            createAntiqueName,
            updateAntiqueName,
            deleteAntiqueNames,
            site);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): AntiqueNameInput {
        return {
            name: '',
            site: this.site,
        };
    }

}
