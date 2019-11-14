import gql from 'graphql-tag';
import { institutionDetails } from '../../institutions/services/institution.queries';
import { userMetaFragment } from '../../shared/queries/fragments';

export const collectionsQuery = gql`
    query Collections($filter: CollectionFilter, $pagination: PaginationInput) {
        collections(filter: $filter, pagination: $pagination) {
            items {
                id
                name
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const collectionQuery = gql`
    query Collection($id: CollectionID!) {
        collection(id: $id) {
            id
            name
            description
            isSource
            sorting
            visibility
            parent {
                id
                name
            }
            institution {
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

export const createCollection = gql`
    mutation CreateCollection ($input: CollectionInput!) {
        createCollection (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateCollection = gql`
    mutation UpdateCollection($id: CollectionID!, $input: CollectionPartialInput!) {
        updateCollection(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
            institution {
                ...institutionDetails
            }
        }
    }
    ${userMetaFragment}
${institutionDetails}`;

export const deleteCollections = gql`
    mutation DeleteCollections ($ids: [CollectionID!]!){
        deleteCollections(ids: $ids)
    }`;

export const linkCollectionToCollection = gql`
    mutation LinkCollectionToCollection ($sourceCollection: CollectionID!, $targetCollection: CollectionID!) {
        linkCollectionToCollection(sourceCollection: $sourceCollection, targetCollection: $targetCollection) {
            id
        }
    }`;
