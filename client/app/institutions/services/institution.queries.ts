import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const institutionDetails = gql`
    fragment institutionDetails on Institution {
        id
        name
        locality
        street
        postcode
        latitude
        longitude
        creationDate
        country {
            id
            code
            name
        }
    }`;

export const institutionsQuery = gql`
    query Institutions($filter: InstitutionFilter, $pagination: PaginationInput) {
        institutions(filter: $filter, pagination: $pagination) {
            items {
                id
                name
                locality
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const institutionQuery = gql`
    query Institution($id: InstitutionID!) {
        institution(id: $id) {
            ...institutionDetails
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
            permissions {
                update
                delete
            }
        }
    }
    ${userMetaFragment}
${institutionDetails}`;

export const createInstitution = gql`
    mutation CreateInstitution ($input: InstitutionInput!) {
        createInstitution (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateInstitution = gql`
    mutation UpdateInstitution($id: InstitutionID!, $input: InstitutionPartialInput!) {
        updateInstitution(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const deleteInstitutions = gql`
    mutation DeleteInstitutions ($ids: [InstitutionID!]!){
        deleteInstitutions(ids: $ids)
    }`;
