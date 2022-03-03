import {gql} from '@apollo/client/core';

export const fileMinimalFragment = gql`
    fragment FileMinimal on File {
        id
        name
        permissions {
            update
            delete
        }
    }
`;

export const filesQuery = gql`
    query Files($filter: FileFilter, $sorting: [FileSorting!], $pagination: PaginationInput) {
        files(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...FileMinimal
            }
            pageSize
            pageIndex
            length
        }
    }
    ${fileMinimalFragment}
`;

export const createFileMutation = gql`
    mutation CreateFile($input: FileInput!) {
        createFile(input: $input) {
            ...FileMinimal
        }
    }
    ${fileMinimalFragment}
`;

export const deleteFileMutation = gql`
    mutation DeleteFile($ids: [FileID!]!) {
        deleteFiles(ids: $ids)
    }
`;
