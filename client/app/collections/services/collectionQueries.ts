import gql from 'graphql-tag';
import { institutionDetails } from '../../institutions/services/institutionQueries';
import { userMetaFragment } from '../../shared/queries/fragments';

export const collectionsQuery = gql`
    query Collections($filters: OldCollectionFilter, $pagination: PaginationInput) {
        collections(filters: $filters, pagination: $pagination) {
            items {
                id
                name
                children {
                    id
                    name
                    children {
                        id
                        name
                        children {
                            id
                            name
                            children {
                                id
                                name
                            }
                        }
                    }
                }
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

export const createCollectionMutation = gql`
    mutation CreateCollection ($input: CollectionInput!) {
        createCollection (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateCollectionMutation = gql`
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

export const deleteCollectionsMutation = gql`
    mutation DeleteCollections ($ids: [CollectionID!]!){
        deleteCollections(ids: $ids)
    }`;

export const linkCollectionToCollectionMutation = gql`
    mutation LinkCollectionToCollection ($sourceCollection: CollectionID!, $targetCollection: CollectionID!) {
        linkCollectionToCollection(sourceCollection: $sourceCollection, targetCollection: $targetCollection) {
            id
        }
    }`;
