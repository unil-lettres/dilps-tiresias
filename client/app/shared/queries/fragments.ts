import {gql} from '@apollo/client';

export const userMetaFragment = gql`
    fragment UserMeta on User {
        id
        login
        email
    }
`;
