import gql from 'graphql-tag';

export const userMetaFragment = gql`
    fragment userMeta on User {
        id
        login
        email
    }
`;
