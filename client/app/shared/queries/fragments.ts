import {gql} from 'apollo-angular';

export const userMetaFragment = gql`
    fragment UserMeta on User {
        id
        login
        email
    }
`;
