import gql from 'graphql-tag';

export const countriesQuery = gql`
    query Countries($filter: CountryFilter, $pagination: PaginationInput) {
        countries(filter: $filter, pagination: $pagination) {
            items {
                id
                code
                name
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const countryQuery = gql`
    query Country($id: CountryID!) {
        country(id: $id) {
            id
            code
            name
        }
    }
`;
