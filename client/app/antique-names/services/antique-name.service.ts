import {Injectable} from '@angular/core';
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
import {
    antiqueNameQuery,
    antiqueNamesQuery,
    createAntiqueName,
    deleteAntiqueNames,
    updateAntiqueName,
} from './antique-name.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

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
        super(
            'antiqueName',
            antiqueNameQuery,
            antiqueNamesQuery,
            createAntiqueName,
            updateAntiqueName,
            deleteAntiqueNames,
        );
    }

    public override getDefaultForServer(): AntiqueNameInput {
        return {
            name: '',
            site: this.site,
        };
    }
}
