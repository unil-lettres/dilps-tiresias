import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const newsesQuery = gql`
    query Newses($filter: NewsFilter, $sorting: [NewsSorting!], $pagination: PaginationInput) {
        newses(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                description
                imageUrl
                url
                hasImage
                isActive
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const newsQuery = gql`
    query News($id: NewsID!) {
        news(id: $id) {
            id
            name
            description
            imageUrl
            url
            hasImage
            isActive
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

export const createNews = gql`
    mutation CreateNews ($input: NewsInput!) {
        createNews (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateNews = gql`
    mutation UpdateNews($id: NewsID!, $input: NewsPartialInput!) {
        updateNews(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const deleteNewses = gql`
    mutation DeleteNewses ($ids: [NewsID!]!){
        deleteNewses(ids: $ids)
    }`;
