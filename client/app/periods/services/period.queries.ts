import {gql} from '@apollo/client/core';
import {userMetaFragment} from '../../shared/queries/fragments';

export const periodsQuery = gql`
    query Periods($filter: PeriodFilter, $sorting: [PeriodSorting!], $pagination: PaginationInput) {
        periods(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                from
                to
                hierarchicName
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const periodQuery = gql`
    query Period($id: PeriodID!) {
        period(id: $id) {
            id
            name
            from
            to
            hierarchicName
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

export const createPeriod = gql`
    mutation CreatePeriod($input: PeriodInput!) {
        createPeriod(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updatePeriod = gql`
    mutation UpdatePeriod($id: PeriodID!, $input: PeriodPartialInput!) {
        updatePeriod(id: $id, input: $input) {
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deletePeriods = gql`
    mutation DeletePeriods($ids: [PeriodID!]!) {
        deletePeriods(ids: $ids)
    }
`;
