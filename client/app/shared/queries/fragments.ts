import {gql} from '@apollo/client/core';

export const userMetaFragment = gql`
    fragment UserMeta on User {
        id
        login
        email
    }
`;
