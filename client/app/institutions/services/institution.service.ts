import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {SITE} from '../../app.config';
import {
    CreateInstitution,
    CreateInstitutionVariables,
    DeleteInstitutions,
    Institution,
    InstitutionInput,
    Institutions,
    InstitutionsVariables,
    InstitutionVariables,
    Site,
    UpdateInstitution,
    UpdateInstitutionVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {
    createInstitution,
    deleteInstitutions,
    institutionQuery,
    institutionsQuery,
    updateInstitution,
} from './institution.queries';
import {NaturalDebounceService} from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class InstitutionService extends AbstractContextualizedService<
    Institution['institution'],
    InstitutionVariables,
    Institutions['institutions'],
    InstitutionsVariables,
    CreateInstitution['createInstitution'],
    CreateInstitutionVariables,
    UpdateInstitution['updateInstitution'],
    UpdateInstitutionVariables,
    DeleteInstitutions['deleteInstitutions'],
    never
> {
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService, @Inject(SITE) site: Site) {
        super(
            apollo,
            naturalDebounceService,
            'institution',
            institutionQuery,
            institutionsQuery,
            createInstitution,
            updateInstitution,
            deleteInstitutions,
            site,
        );
    }

    public override getDefaultForServer(): InstitutionInput {
        return {
            site: this.site,
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
