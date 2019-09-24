import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const artistsQuery = gql`
    query Artists($filters: OldArtistFilter, $pagination: PaginationInput) {
        artists(filters: $filters, pagination: $pagination) {
            items {
                id
                name
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const artistQuery = gql`
    query Artist($id: ArtistID!) {
        artist(id: $id) {
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

export const createArtistMutation = gql`
    mutation CreateArtist ($input: ArtistInput!) {
        createArtist (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateArtistMutation = gql`
    mutation UpdateArtist($id: ArtistID!, $input: ArtistPartialInput!) {
        updateArtist(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const deleteArtistsMutation = gql`
    mutation DeleteArtists ($ids: [ArtistID!]!){
        deleteArtists(ids: $ids)
    }`;
