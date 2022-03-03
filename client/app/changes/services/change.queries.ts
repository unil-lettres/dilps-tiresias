import {gql} from '@apollo/client/core';
import {cardDetailsFragment} from '../../card/services/card.queries';
import {userMetaFragment} from '../../shared/queries/fragments';

export const changesQuery = gql`
    query Changes($filter: ChangeFilter, $pagination: PaginationInput, $sorting: [ChangeSorting!]) {
        changes(filter: $filter, pagination: $pagination, sorting: $sorting) {
            items {
                id
                type
                original {
                    id
                    name
                }
                suggestion {
                    id
                    name
                }
                creationDate
                owner {
                    id
                    login
                }
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const changeQuery = gql`
    query Change($id: ChangeID!) {
        change(id: $id) {
            id
            type
            original {
                ...CardDetails
            }
            suggestion {
                ...CardDetails
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
    ${cardDetailsFragment}
`;

export const acceptChange = gql`
    mutation AcceptChange($id: ChangeID!) {
        acceptChange(id: $id) {
            id
        }
    }
`;

export const rejectChange = gql`
    mutation RejectChange($id: ChangeID!) {
        rejectChange(id: $id)
    }
`;

export const suggestDeletion = gql`
    mutation SuggestDeletion($id: CardID!) {
        suggestDeletion(id: $id, request: "") {
            id
        }
    }
`;

export const suggestCreation = gql`
    mutation SuggestCreation($id: CardID!) {
        suggestCreation(id: $id, request: "") {
            id
        }
    }
`;

export const suggestUpdate = gql`
    mutation SuggestUpdate($id: CardID!) {
        suggestUpdate(id: $id, request: "") {
            id
        }
    }
`;
