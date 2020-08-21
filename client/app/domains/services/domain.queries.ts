import gql from 'graphql-tag';
import {userMetaFragment} from '../../shared/queries/fragments';

export const domainsQuery = gql`
    query Domains($filter: DomainFilter, $sorting: [DomainSorting!], $pagination: PaginationInput) {
        domains(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                hierarchicName
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const domainQuery = gql`
    query Domain($id: DomainID!) {
        domain(id: $id) {
            id
            name
            hierarchicName
            parentHierarchy {
                id
                name
            }
            creationDate
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
`;

export const createDomain = gql`
    mutation CreateDomain($input: DomainInput!) {
        createDomain(input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateDomain = gql`
    mutation UpdateDomain($id: DomainID!, $input: DomainPartialInput!) {
        updateDomain(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteDomains = gql`
    mutation DeleteDomains($ids: [DomainID!]!) {
        deleteDomains(ids: $ids)
    }
`;
