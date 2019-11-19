import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const materialsQuery = gql`
    query Materials($filter:MaterialFilter, $sorting: [MaterialSorting!], $pagination: PaginationInput) {
        materials(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const materialQuery = gql`
    query Material($id: MaterialID!) {
        material(id: $id) {
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

export const createMaterial = gql`
    mutation CreateMaterial ($input: MaterialInput!) {
        createMaterial (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateMaterial = gql`
    mutation UpdateMaterial($id: MaterialID!, $input: MaterialPartialInput!) {
        updateMaterial(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const deleteMaterials = gql`
    mutation DeleteMaterials ($ids: [MaterialID!]!){
        deleteMaterials(ids: $ids)
    }`;
