import {Service} from '@angular/core';
import {
    type AntiqueNameInput,
    type AntiqueNameQuery,
    type AntiqueNameQueryVariables,
    type AntiqueNamesQuery,
    type AntiqueNamesQueryVariables,
    type CreateAntiqueName,
    type CreateAntiqueNameVariables,
    type DeleteAntiqueNames,
    type DeleteAntiqueNamesVariables,
    type UpdateAntiqueName,
    type UpdateAntiqueNameVariables,
} from '../../shared/generated-types';
import {
    antiqueNameQuery,
    antiqueNamesQuery,
    createAntiqueName,
    deleteAntiqueNames,
    updateAntiqueName,
} from './antique-name.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

@Service()
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
    DeleteAntiqueNamesVariables
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
