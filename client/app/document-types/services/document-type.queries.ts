import {gql} from 'apollo-angular';
import {userMetaFragment} from '../../shared/queries/fragments';

export const documentTypesQuery = gql`
    query DocumentTypes($filter: DocumentTypeFilter, $sorting: [DocumentTypeSorting!], $pagination: PaginationInput) {
        documentTypes(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const documentTypeQuery = gql`
    query DocumentType($id: DocumentTypeID!) {
        documentType(id: $id) {
            id
            name
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

export const createDocumentType = gql`
    mutation CreateDocumentType($input: DocumentTypeInput!) {
        createDocumentType(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateDocumentType = gql`
    mutation UpdateDocumentType($id: DocumentTypeID!, $input: DocumentTypePartialInput!) {
        updateDocumentType(id: $id, input: $input) {
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteDocumentTypes = gql`
    mutation DeleteDocumentTypes($ids: [DocumentTypeID!]!) {
        deleteDocumentTypes(ids: $ids)
    }
`;
