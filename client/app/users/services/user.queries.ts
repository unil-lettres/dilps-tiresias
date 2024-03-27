import {gql} from '@apollo/client/core';
import {institutionDetails} from '../../institutions/services/institution.queries';
import {userMetaFragment} from '../../shared/queries/fragments';

const userDetailsFragment = gql`
    fragment UserDetails on User {
        id
        email
        name
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
    ${userMetaFragment}
`;

const viewerFragment = gql`
    fragment ViewerFragment on User {
        ...UserDetails
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
            domain {
                create
            }
            documentType {
                create
            }
            antiqueName {
                create
            }
            news {
                create
            }
            period {
                create
            }
            material {
                create
            }
            tag {
                create
            }
        }
    }
    ${userDetailsFragment}
`;

export const usersQuery = gql`
    query Users($filter: UserFilter, $sorting: [UserSorting!], $pagination: PaginationInput) {
        users(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                login
                name
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
    }
`;

export const userQuery = gql`
    query User($id: UserID!) {
        user(id: $id) {
            ...UserDetails
        }
    }
    ${userDetailsFragment}
`;

export const createUser = gql`
    mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateUser = gql`
    mutation UpdateUser($id: UserID!, $input: UserPartialInput!) {
        updateUser(id: $id, input: $input) {
            id
            name
            termsAgreement
            updateDate
            updater {
                ...UserMeta
            }
            institution {
                ...InstitutionDetails
            }
        }
    }
    ${userMetaFragment}
    ${institutionDetails}
`;

export const deleteUsers = gql`
    mutation DeleteUsers($ids: [UserID!]!) {
        deleteUsers(ids: $ids)
    }
`;

export const loginMutation = gql`
    mutation Login($login: Login!, $password: String!) {
        login(login: $login, password: $password) {
            ...ViewerFragment
        }
    }
    ${viewerFragment}
`;

export const logoutMutation = gql`
    mutation Logout {
        logout
    }
`;

export const viewerQuery = gql`
    query Viewer {
        viewer {
            ...ViewerFragment
        }
    }
    ${viewerFragment}
`;

export const userRolesAvailableQuery = gql`
    query UserRolesAvailables($user: UserID) {
        userRolesAvailable(user: $user)
    }
`;
