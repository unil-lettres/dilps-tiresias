import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const documentTypesQuery = gql`
    query DocumentTypes($filter: DocumentTypeFilter, $pagination: PaginationInput) {
        documentTypes(filter: $filter, pagination: $pagination) {
            items {
                id
                name
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const documentTypeQuery = gql`
    query DocumentType($id: DocumentTypeID!) {
        documentType(id: $id) {
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

export const createDocumentType = gql`
    mutation CreateDocumentType ($input: DocumentTypeInput!) {
        createDocumentType (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateDocumentType = gql`
    mutation UpdateDocumentType($id: DocumentTypeID!, $input: DocumentTypePartialInput!) {
        updateDocumentType(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const deleteDocumentTypes = gql`
    mutation DeleteDocumentTypes ($ids: [DocumentTypeID!]!){
        deleteDocumentTypes(ids: $ids)
    }`;
