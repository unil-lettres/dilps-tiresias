import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const periodsQuery = gql`
    query Periods($filter:PeriodFilter, $pagination: PaginationInput) {
        periods(filter: $filter, pagination: $pagination) {
            items {
                id
                name
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const periodQuery = gql`
    query Period($id: PeriodID!) {
        period(id: $id) {
            id
            name
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
    }${userMetaFragment}`;

export const createPeriod = gql`
    mutation CreatePeriod ($input: PeriodInput!) {
        createPeriod (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updatePeriod = gql`
    mutation UpdatePeriod($id: PeriodID!, $input: PeriodPartialInput!) {
        updatePeriod(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const deletePeriods = gql`
    mutation DeletePeriods ($ids: [PeriodID!]!){
        deletePeriods(ids: $ids)
    }`;
