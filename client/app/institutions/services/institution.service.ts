import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    CreateInstitution,
    DeleteInstitutions,
    Institution,
    Institutions,
    UpdateInstitution,
} from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import {
    createInstitution,
    deleteInstitutions,
    institutionQuery,
    institutionsQuery,
    updateInstitution,
} from './institutionQueries';

@Injectable({
    providedIn: 'root',
})
export class InstitutionService
    extends AbstractModelService<Institution['institution'],
        Institutions['institutions'],
        CreateInstitution['createInstitution'],
        UpdateInstitution['updateInstitution'],
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
