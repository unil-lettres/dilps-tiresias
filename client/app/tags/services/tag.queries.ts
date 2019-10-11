import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const tagsQuery = gql`
    query Tags($filter:TagFilter, $pagination: PaginationInput) {
        tags(filter: $filter, pagination: $pagination) {
            items {
                id
                name
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const tagQuery = gql`
    query Tag($id: TagID!) {
        tag(id: $id) {
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

export const createTag = gql`
    mutation CreateTag ($input: TagInput!) {
        createTag (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateTag = gql`
    mutation UpdateTag($id: TagID!, $input: TagPartialInput!) {
        updateTag(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const deleteTags = gql`
    mutation DeleteTags ($ids: [TagID!]!){
        deleteTags(ids: $ids)
    }`;
