import {gql} from 'apollo-angular';
import {userMetaFragment} from '../../shared/queries/fragments';

const exportMinimalFragment = gql`
    fragment ExportMinimal on Export {
        id
        format
        cardCount
        fileSize
        filename
        creationDate
        creator {
            ...UserMeta
        }
        updateDate
        updater {
            ...UserMeta
        }
    }
    ${userMetaFragment}
`;

export const exportsQuery = gql`
    query Exports($filter: ExportFilter, $sorting: [ExportSorting!], $pagination: PaginationInput) {
        exports(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...ExportMinimal
            }
            pageSize
            pageIndex
            length
        }
    }
    ${exportMinimalFragment}
`;

export const exportQuery = gql`
    query Export($id: ExportID!) {
        export(id: $id) {
            ...ExportMinimal
        }
    }
    ${exportMinimalFragment}
`;

export const createExport = gql`
    mutation CreateExport($input: CreateExportInput!) {
        createExport(input: $input) {
            ...ExportMinimal
        }
    }
    ${exportMinimalFragment}
`;

export const validateExportQuery = gql`
    query ValidateExport($input: CreateExportInput!) {
        validateExport(input: $input)
    }
`;
