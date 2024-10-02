import {Injectable, inject} from '@angular/core';
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
    public constructor() {
        const site = inject<Site>(SITE);

        super(
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
