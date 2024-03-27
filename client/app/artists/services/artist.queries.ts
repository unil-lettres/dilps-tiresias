import {gql} from '@apollo/client/core';
import {userMetaFragment} from '../../shared/queries/fragments';

export const artistsQuery = gql`
    query Artists($filter: ArtistFilter, $sorting: [ArtistSorting!], $pagination: PaginationInput) {
        artists(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                usageCount
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const artistQuery = gql`
    query Artist($id: ArtistID!) {
        artist(id: $id) {
            id
            name
            usageCount
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

export const createArtist = gql`
    mutation CreateArtist($input: ArtistInput!) {
        createArtist(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateArtist = gql`
    mutation UpdateArtist($id: ArtistID!, $input: ArtistPartialInput!) {
        updateArtist(id: $id, input: $input) {
            id
            name
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteArtists = gql`
    mutation DeleteArtists($ids: [ArtistID!]!) {
        deleteArtists(ids: $ids)
    }
`;
