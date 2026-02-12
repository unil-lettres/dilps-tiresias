import {Injectable} from '@angular/core';
import {
    CreateInstitution,
    CreateInstitutionVariables,
    DeleteInstitutions,
    InstitutionQuery,
    InstitutionInput,
    InstitutionsQuery,
    InstitutionsQueryVariables,
    InstitutionQueryVariables,
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
    InstitutionQuery['institution'],
    InstitutionQueryVariables,
    InstitutionsQuery['institutions'],
    InstitutionsQueryVariables,
    CreateInstitution['createInstitution'],
    CreateInstitutionVariables,
    UpdateInstitution['updateInstitution'],
    UpdateInstitutionVariables,
    DeleteInstitutions['deleteInstitutions'],
    never
> {
    public constructor() {
        super(
            'institution',
            institutionQuery,
            institutionsQuery,
            createInstitution,
            updateInstitution,
            deleteInstitutions,
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
