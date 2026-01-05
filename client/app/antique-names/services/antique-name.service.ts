import {Injectable} from '@angular/core';
import {
    AntiqueNameQuery,
    AntiqueNameInput,
    AntiqueNamesQuery,
    AntiqueNamesQueryVariables,
    AntiqueNameQueryVariables,
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
    AntiqueNameQuery['antiqueName'],
    AntiqueNameQueryVariables,
    AntiqueNamesQuery['antiqueNames'],
    AntiqueNamesQueryVariables,
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
