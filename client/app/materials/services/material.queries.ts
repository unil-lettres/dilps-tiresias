import {gql} from '@apollo/client/core';
import {userMetaFragment} from '../../shared/queries/fragments';

export const materialsQuery = gql`
    query Materials($filter: MaterialFilter, $sorting: [MaterialSorting!], $pagination: PaginationInput) {
        materials(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                hierarchicName
                hasChildren
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const materialQuery = gql`
    query Material($id: MaterialID!) {
        material(id: $id) {
            id
            name
            hierarchicName
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

export const createMaterial = gql`
    mutation CreateMaterial($input: MaterialInput!) {
        createMaterial(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateMaterial = gql`
    mutation UpdateMaterial($id: MaterialID!, $input: MaterialPartialInput!) {
        updateMaterial(id: $id, input: $input) {
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteMaterials = gql`
    mutation DeleteMaterials($ids: [MaterialID!]!) {
        deleteMaterials(ids: $ids)
    }
`;
