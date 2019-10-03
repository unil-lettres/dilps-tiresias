import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    CreateInstitution,
    CreateInstitutionVariables,
    DeleteInstitutions,
    Institution,
    Institutions,
    InstitutionsVariables,
    InstitutionVariables,
    UpdateInstitution,
    UpdateInstitutionVariables,
} from '../../shared/generated-types';
import {
    createInstitution,
    deleteInstitutions,
    institutionQuery,
    institutionsQuery,
    updateInstitution,
} from './institution.queries';
import { NaturalAbstractModelService } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class InstitutionService
    extends NaturalAbstractModelService<Institution['institution'],
        InstitutionVariables,
        Institutions['institutions'],
        InstitutionsVariables,
        CreateInstitution['createInstitution'],
        CreateInstitutionVariables,
        UpdateInstitution['updateInstitution'],
        UpdateInstitutionVariables,
        DeleteInstitutions['deleteInstitutions']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'institution',
            institutionQuery,
            institutionsQuery,
            createInstitution,
            updateInstitution,
            deleteInstitutions);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
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
