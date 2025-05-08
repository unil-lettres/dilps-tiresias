import {gql} from '@apollo/client/core';
import {userMetaFragment} from '../../shared/queries/fragments';

export const domainsQuery = gql`
    query Domains($filter: DomainFilter, $sorting: [DomainSorting!], $pagination: PaginationInput) {
        domains(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                usageCount
                hierarchicName
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const cardDomainsQuery = gql`
    query CardDomains($filter: CardFilter) {
        cardDomains(filter: $filter) {
            id
            name
        }
    }
`;

export const domainQuery = gql`
    query Domain($id: DomainID!) {
        domain(id: $id) {
            id
            name
            usageCount
            hierarchicName
            parent {
                id
                name
            }
            parentHierarchy {
                id
                name
            }
            creationDate
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
`;

export const createDomain = gql`
    mutation CreateDomain($input: DomainInput!) {
        createDomain(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateDomain = gql`
    mutation UpdateDomain($id: DomainID!, $input: DomainPartialInput!) {
        updateDomain(id: $id, input: $input) {
            id
            name
            updateDate
            updater {
                ...UserMeta
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
