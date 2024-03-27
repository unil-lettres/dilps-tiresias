import {gql} from '@apollo/client/core';
import {institutionDetails} from '../../institutions/services/institution.queries';
import {userMetaFragment} from '../../shared/queries/fragments';

export const collectionsQuery = gql`
    query Collections($filter: CollectionFilter, $pagination: PaginationInput) {
        collections(filter: $filter, pagination: $pagination) {
            items {
                id
                name
                hierarchicName
                hasUsers
                isSource
                copyrights
                usageRights
                permissions {
                    update
                    delete
                }
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const collectionQuery = gql`
    query Collection($id: CollectionID!) {
        collection(id: $id) {
            id
            name
            description
            copyrights
            usageRights
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

export const createCollection = gql`
    mutation CreateCollection($input: CollectionInput!) {
        createCollection(input: $input) {
            id
            name
            hierarchicName
            isSource
            copyrights
            usageRights
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateCollection = gql`
    mutation UpdateCollection($id: CollectionID!, $input: CollectionPartialInput!) {
        updateCollection(id: $id, input: $input) {
            id
            name
            updateDate
            updater {
                ...UserMeta
            }
            institution {
                ...InstitutionDetails
            }
        }
    }
    ${userMetaFragment}
    ${institutionDetails}
`;

export const deleteCollections = gql`
    mutation DeleteCollections($ids: [CollectionID!]!) {
        deleteCollections(ids: $ids)
    }
`;

export const linkCollectionToCollection = gql`
    mutation LinkCollectionToCollection($sourceCollection: CollectionID!, $targetCollection: CollectionID!) {
        linkCollectionToCollection(sourceCollection: $sourceCollection, targetCollection: $targetCollection) {
            id
        }
    }
`;
