import gql from 'graphql-tag';

export const userMetaFragment = gql`
    fragment UserMeta on User {
        id
        login
        email
    }
`;
