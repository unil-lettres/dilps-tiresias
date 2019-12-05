import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';

import {
    AntiqueName,
    AntiqueNameInput,
    AntiqueNames,
    AntiqueNamesVariables,
    AntiqueNameVariables,
    CreateAntiqueName,
    CreateAntiqueNameVariables,
    DeleteAntiqueNames,
    UpdateAntiqueName,
    UpdateAntiqueNameVariables,
} from '../../shared/generated-types';
import { antiqueNameQuery, antiqueNamesQuery, createAntiqueName, deleteAntiqueNames, updateAntiqueName } from './antique-name.queries';

@Injectable({
    providedIn: 'root',
})
export class AntiqueNameService
    extends NaturalAbstractModelService<AntiqueName['antiqueName'],
        AntiqueNameVariables,
        AntiqueNames['antiqueNames'],
        AntiqueNamesVariables,
        CreateAntiqueName['createAntiqueName'],
        CreateAntiqueNameVariables,
        UpdateAntiqueName['updateAntiqueName'],
        UpdateAntiqueNameVariables,
        DeleteAntiqueNames['deleteAntiqueNames']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'antiqueName',
            antiqueNameQuery,
            antiqueNamesQuery,
            createAntiqueName,
            updateAntiqueName,
            deleteAntiqueNames);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): AntiqueNameInput {
        return {
            name: '',
        };
    }

}
