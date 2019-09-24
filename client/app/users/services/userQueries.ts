import gql from 'graphql-tag';
import { institutionDetails } from '../../institutions/services/institutionQueries';
import { userMetaFragment } from '../../shared/queries/fragments';

const userDetailsFragment = gql`
    fragment userDetails on User {
        id
        email
        login
        activeUntil
        role
        termsAgreement
        type
        institution {
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
    }${userMetaFragment}`;

export const usersQuery = gql`
    query Users($filters: OldUserFilter, $pagination: PaginationInput) {
        users(filters: $filters, pagination: $pagination) {
            items {
                id
                login
                email
                role
                type
                activeUntil
                termsAgreement
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const userQuery = gql`
    query User($id: UserID!) {
        user(id: $id) {
            ...userDetails
        }
    }${userDetailsFragment}`;

export const createUserMutation = gql`
    mutation CreateUser ($input: UserInput!) {
        createUser (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateUserMutation = gql`
    mutation UpdateUser($id: UserID!, $input: UserPartialInput!) {
        updateUser(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
            institution {
                ...institutionDetails
            }
        }
    }
    ${userMetaFragment}
${institutionDetails}`;

export const deleteUsersMutation = gql`
    mutation DeleteUsers ($ids: [UserID!]!){
        deleteUsers(ids: $ids)
    }`;

export const loginMutation = gql`
    mutation Login ($login: Login! $password: String!){
        login(login: $login password: $password) {
            ...userDetails
        }
    }${userDetailsFragment}`;

export const logoutMutation = gql`
    mutation Logout {
        logout
    }`;

export const viewerQuery = gql`
    query Viewer {
        viewer {
            ...userDetails
            globalPermissions {
                artist {
                    create
                }
                card {
                    create
                }
                change {
                    create
                }
                collection {
                    create
                }
                dating {
                    create
                }
                institution {
                    create
                }
                user {
                    create
                }
            }
        }
    }${userDetailsFragment}`;
