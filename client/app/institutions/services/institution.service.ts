import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    CreateInstitutionMutation,
    DeleteInstitutionsMutation,
    InstitutionInput,
    InstitutionQuery,
    InstitutionsQuery,
    UpdateInstitutionMutation,
} from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import {
    createInstitutionMutation,
    deleteInstitutionsMutation,
    institutionQuery,
    institutionsQuery,
    updateInstitutionMutation,
} from './institutionQueries';

@Injectable({
    providedIn: 'root'
})
export class InstitutionService
    extends AbstractModelService<InstitutionQuery['institution'],
        InstitutionsQuery['institutions'],
        CreateInstitutionMutation['createInstitution'],
        UpdateInstitutionMutation['updateInstitution'],
        DeleteInstitutionsMutation['deleteInstitutions']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'institution',
            institutionQuery,
            institutionsQuery,
            createInstitutionMutation,
            updateInstitutionMutation,
            deleteInstitutionsMutation);
    }

    public getEmptyObject(): InstitutionInput {
        return {
            name: '',
            street: '',
            postcode: '',
            locality: '',
            area: '',
            latitude: null,
            longitude: null,
            country: null,
        };
    }

}
