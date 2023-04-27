import {gql} from '@apollo/client/core';
import {userMetaFragment} from '../../shared/queries/fragments';

export const tagsQuery = gql`
    query Tags($filter: TagFilter, $sorting: [TagSorting!], $pagination: PaginationInput) {
        tags(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                usageCount
                hierarchicName
                hasChildren
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const tagQuery = gql`
    query Tag($id: TagID!) {
        tag(id: $id) {
            id
            name
            usageCount
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

export const createTag = gql`
    mutation CreateTag($input: TagInput!) {
        createTag(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateTag = gql`
    mutation UpdateTag($id: TagID!, $input: TagPartialInput!) {
        updateTag(id: $id, input: $input) {
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteTags = gql`
    mutation DeleteTags($ids: [TagID!]!) {
        deleteTags(ids: $ids)
    }
`;
