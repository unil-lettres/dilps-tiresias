import {gql} from '@apollo/client/core';
import {userMetaFragment} from '../../shared/queries/fragments';

export const antiqueNamesQuery = gql`
    query AntiqueNames($filter: AntiqueNameFilter, $sorting: [AntiqueNameSorting!], $pagination: PaginationInput) {
        antiqueNames(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                usageCount
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const antiqueNameQuery = gql`
    query AntiqueName($id: AntiqueNameID!) {
        antiqueName(id: $id) {
            id
            name
            usageCount
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

export const createAntiqueName = gql`
    mutation CreateAntiqueName($input: AntiqueNameInput!) {
        createAntiqueName(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateAntiqueName = gql`
    mutation UpdateAntiqueName($id: AntiqueNameID!, $input: AntiqueNamePartialInput!) {
        updateAntiqueName(id: $id, input: $input) {
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

export const deleteAntiqueNames = gql`
    mutation DeleteAntiqueNames($ids: [AntiqueNameID!]!) {
        deleteAntiqueNames(ids: $ids)
    }
`;
