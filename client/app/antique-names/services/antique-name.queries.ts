import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const antiqueNamesQuery = gql`
    query AntiqueNames($filter:AntiqueNameFilter, $pagination: PaginationInput) {
        antiqueNames(filter: $filter, pagination: $pagination) {
            items {
                id
                name
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const antiqueNameQuery = gql`
    query AntiqueName($id: AntiqueNameID!) {
        antiqueName(id: $id) {
            id
            name
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

export const createAntiqueName = gql`
    mutation CreateAntiqueName ($input: AntiqueNameInput!) {
        createAntiqueName (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateAntiqueName = gql`
    mutation UpdateAntiqueName($id: AntiqueNameID!, $input: AntiqueNamePartialInput!) {
        updateAntiqueName(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const deleteAntiqueNames = gql`
    mutation DeleteAntiqueNames ($ids: [AntiqueNameID!]!){
        deleteAntiqueNames(ids: $ids)
    }`;
