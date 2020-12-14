import {gql} from 'apollo-angular';
import {institutionDetails} from '../../institutions/services/institution.queries';
import {userMetaFragment} from '../../shared/queries/fragments';

export const cardDetailsFragment = gql`
    fragment CardDetails on Card {
        id
        legacyId
        site
        code
        name
        expandedName
        hasImage
        height
        width
        visibility
        dating
        precision
        documentSize
        technique
        techniqueAuthor
        techniqueDate
        format
        url
        urlDescription
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
        objectReference
        productionPlace
        from
        to
        cards {
            id
            name
        }
        antiqueNames {
            id
            name
        }
        datings {
            from
            to
        }
        artists {
            id
            name
        }
        original {
            id
            width
            height
        }
        addition
        material
        materials {
            id
            name
            hierarchicName
            hasChildren
        }
        periods {
            id
            name
            hierarchicName
            from
            to
        }
        documentType {
            id
            name
        }
        tags {
            id
            name
            hierarchicName
            hasChildren
        }
        domains {
            id
            name
            hierarchicName
        }
        collections {
            id
            name
            isSource
            copyrights
            usageRights
            hierarchicName
            visibility
        }
        country {
            id
            code
            name
        }
        institution {
            ...InstitutionDetails
        }
        owner {
            ...UserMeta
        }
        creationDate
        creator {
            ...UserMeta
        }
        updateDate
        updater {
            ...UserMeta
        }
        dataValidationDate
        dataValidator {
            ...UserMeta
        }
        imageValidationDate
        imageValidator {
            ...UserMeta
        }
        permissions {
            update
            delete
        }
    }
    ${userMetaFragment}
    ${institutionDetails}
`;

export const cardsQuery = gql`
    query Cards($filter: CardFilter, $pagination: PaginationInput, $sorting: [CardSorting!]) {
        cards(filter: $filter, pagination: $pagination, sorting: $sorting) {
            items {
                ...CardDetails
            }
            pageSize
            pageIndex
            offset
            length
        }
    }
    ${cardDetailsFragment}
`;

export const cardQuery = gql`
    query Card($id: CardID!) {
        card(id: $id) {
            ...CardDetails
        }
    }
    ${cardDetailsFragment}
`;

export const createCard = gql`
    mutation CreateCard($input: CardInput!, $collection: CollectionID) {
        createCard(input: $input, collection: $collection) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const createCards = gql`
    mutation CreateCards($excel: Upload!, $images: [Upload!]!, $collection: CollectionID) {
        createCards(excel: $excel, images: $images, collection: $collection) {
            id
        }
    }
`;

export const updateCard = gql`
    mutation UpdateCard($id: CardID!, $input: CardPartialInput!) {
        updateCard(id: $id, input: $input) {
            institution {
                ...InstitutionDetails
            }
            artists {
                id
                name
            }
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
    ${institutionDetails}
`;

export const deleteCards = gql`
    mutation DeleteCards($ids: [CardID!]!) {
        deleteCards(ids: $ids)
    }
`;

export const validateData = gql`
    mutation ValidateData($id: CardID!) {
        validateData(id: $id) {
            ...CardDetails
        }
    }
    ${cardDetailsFragment}
`;

export const validateImage = gql`
    mutation ValidateImage($id: CardID!) {
        validateImage(id: $id) {
            ...CardDetails
        }
    }
    ${cardDetailsFragment}
`;
