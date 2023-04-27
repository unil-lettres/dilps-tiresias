import {gql} from '@apollo/client/core';
import {userMetaFragment} from '../../shared/queries/fragments';

export const institutionDetails = gql`
    fragment InstitutionDetails on Institution {
        id
        name
        usageCount
        locality
        street
        postcode
        latitude
        longitude
        precision
        creationDate
        country {
            id
            code
            name
        }
    }
`;

export const institutionsQuery = gql`
    query Institutions($filter: InstitutionFilter, $sorting: [InstitutionSorting!], $pagination: PaginationInput) {
        institutions(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                usageCount
                locality
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const institutionQuery = gql`
    query Institution($id: InstitutionID!) {
        institution(id: $id) {
            ...InstitutionDetails
            creator {
                ...UserMeta
            }
            updateDate
            updater {
                ...UserMeta
            }
            permissions {
                update
                delete
            }
        }
    }
    ${userMetaFragment}
    ${institutionDetails}
`;

export const createInstitution = gql`
    mutation CreateInstitution($input: InstitutionInput!) {
        createInstitution(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateInstitution = gql`
    mutation UpdateInstitution($id: InstitutionID!, $input: InstitutionPartialInput!) {
        updateInstitution(id: $id, input: $input) {
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteInstitutions = gql`
    mutation DeleteInstitutions($ids: [InstitutionID!]!) {
        deleteInstitutions(ids: $ids)
    }
`;
