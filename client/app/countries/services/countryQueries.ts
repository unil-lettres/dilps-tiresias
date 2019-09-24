import gql from 'graphql-tag';

export const countriesQuery = gql`
    query Countries($pagination: PaginationInput) {
        countries(pagination: $pagination) {
            items {
                id
                code
                name
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const countryQuery = gql`
    query Country($id: CountryID!) {
        country(id: $id) {
            id
            code
            name
        }
    }`;
