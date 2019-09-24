import gql from 'graphql-tag';
import { institutionDetails } from '../../institutions/services/institutionQueries';
import { userMetaFragment } from '../../shared/queries/fragments';

export const cardDetailsFragment = gql`
    fragment cardDetails on Card {
        id
        name
        expandedName
        hasImage
        height
        width
        visibility
        dating
        datings {
            from
            to
        }
        artists {
            id
            name
        }
        institution {
            id
            name
            locality
            street
            postcode
            latitude
            longitude
            country {
                id
                code
                name
            }
        }
        original {
            id
            width
            height
        }
        addition
        material
        technique
        techniqueAuthor
        format
        literature
        page
        figure
        table
        isbn
        comment
        rights
        muserisUrl
        muserisCote
        locality
        street
        postcode
        latitude
        longitude
        cards {
            id
            name
        }
        collections {
            id
            name
        }
        country {
            id
            code
            name
        }
        owner {
            ...userMeta
        }
        creationDate
        creator {
            ...userMeta
        }
        updateDate
        updater {
            ...userMeta
        }
        dataValidationDate
        dataValidator {
            ...userMeta
        }
        imageValidationDate
        imageValidator {
            ...userMeta
        }
        permissions {
            update
            delete
        }
    }${userMetaFragment}`;

export const cardsQuery = gql`
    query Cards($filter: CardFilter, $filters: OldCardFilter, $pagination: PaginationInput, $sorting: [CardSorting!]) {
        cards(filter: $filter, filters: $filters, pagination: $pagination, sorting: $sorting) {
            items {
                ...cardDetails
            }
            pageSize
            pageIndex
            length
        }
    }${cardDetailsFragment}`;

export const cardQuery = gql`
    query Card($id: CardID!) {
        card(id: $id) {
            ...cardDetails
        }
    }${cardDetailsFragment}`;

export const createCardMutation = gql`
    mutation CreateCard ($input: CardInput!) {
        createCard (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateCardMutation = gql`
    mutation UpdateCard($id: CardID!, $input: CardPartialInput!) {
        updateCard(id: $id, input: $input) {
            institution {
                ...institutionDetails
            }
            artists {
                id
                name
            }
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
${institutionDetails}`;

export const deleteCardsMutation = gql`
    mutation DeleteCards ($ids: [CardID!]!){
        deleteCards(ids: $ids)
    }`;

export const validateData = gql`
    mutation ValidateData($id: CardID!) {
        validateData(id: $id) {
            ...cardDetails
        }
    }${cardDetailsFragment}`;

export const validateImage = gql`
    mutation ValidateImage($id: CardID!) {
        validateImage(id: $id) {
            ...cardDetails
        }
    }${cardDetailsFragment}`;
