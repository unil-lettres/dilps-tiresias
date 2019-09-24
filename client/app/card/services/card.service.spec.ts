import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AbstractModelServiceSpec } from '../../shared/testing/AbstractModelServiceSpec';
import { MOCK_APOLLO_PROVIDER } from '../../shared/testing/MOCK_APOLLO_PROVIDER';
import { userMetaTesting } from '../../shared/testing/userMetaTesting';
import { CardService } from './card.service';

describe('CardService', () => {

    const expectedOne = {
        id: '456',
        name: 'test string',
        expandedName: 'test string',
        height: 1,
        width: 1,
        hasImage: true,
        visibility: 'private',
        dating: 'test string',
        artists: [
            {
                id: '456',
                name: 'test string',
                __typename: 'Artist',
            },
            {
                id: '456',
                name: 'test string',
                __typename: 'Artist',
            },
        ],
        institution: {
            id: '456',
            name: 'test string',
            street: 'test string',
            postcode: 'test string',
            locality: 'test string',
            latitude: 0.5,
            longitude: 0.5,
            country: {
                id: '456',
                code: 'test string',
                name: 'test string',
                __typename: 'Country',
            },
            __typename: 'Institution',
        },
        original: {
            id: '456',
            width: 1,
            height: 1,
            __typename: 'Card',
        },
        cards: [
            {
                id: '456',
                name: 'test string',
                __typename: 'Card',
            },
            {
                id: '456',
                name: 'test string',
                __typename: 'Card',
            },
        ],
        addition: 'test string',
        material: 'test string',
        technique: 'test string',
        techniqueAuthor: 'test string',
        format: 'test string',
        literature: 'test string',
        page: 'test string',
        figure: 'test string',
        table: 'test string',
        isbn: 'test string',
        comment: 'test string',
        rights: 'test string',
        muserisUrl: 'test string',
        muserisCote: 'test string',
        street: 'test string',
        postcode: 'test string',
        locality: 'test string',
        latitude: 0.5,
        longitude: 0.5,
        collections: [
            {
                id: '456',
                name: 'test string',
                __typename: 'Collection',
            },
            {
                id: '456',
                name: 'test string',
                __typename: 'Collection',
            },
        ],
        country: {
            id: '456',
            code: 'test string',
            name: 'test string',
            __typename: 'Country',
        },
        __typename: 'Card',
        owner: userMetaTesting,
        creationDate: '2018-01-18T11:43:31',
        creator: userMetaTesting,
        updateDate: '2018-01-18T11:43:31',
        updater: userMetaTesting,
        dataValidationDate: '2018-01-18T11:43:31',
        dataValidator: userMetaTesting,
        imageValidationDate: '2018-01-18T11:43:31',
        imageValidator: userMetaTesting,
        datings: [
            {
                from: '2018-01-18T11:43:31',
                to: '2018-01-18T11:43:31',
                __typename: 'Dating',
            },
            {
                from: '2018-01-18T11:43:31',
                to: '2018-01-18T11:43:31',
                __typename: 'Dating',
            },
        ],
        permissions: {
            update: true,
            delete: true,
            __typename: 'Permissions',
        },
    };

    const expectedOneForAll = expectedOne;

    const expectedAll = {
        items: [
            expectedOneForAll,
            expectedOneForAll,
        ],
        pageSize: 1,
        pageIndex: 1,
        length: 1,
        __typename: 'CardPagination',
    };

    const expectedCreate = {
        id: '456',
        creationDate: '2018-01-18T11:43:31',
        creator: userMetaTesting,
        __typename: 'Card',
    };

    const expectedUpdate = {
        id: 123,
        updateDate: '2018-01-18T11:43:31',
        updater: userMetaTesting,
        artists: [
            {
                id: '456',
                name: 'test string',
                __typename: 'Artist',
            },
            {
                id: '456',
                name: 'test string',
                __typename: 'Artist',
            },
        ],
        institution: {
            id: '456',
            name: 'test string',
            street: 'test string',
            postcode: 'test string',
            locality: 'test string',
            latitude: 0.5,
            longitude: 0.5,
            creationDate: '2018-01-18T11:43:31',
            country: {
                id: '456',
                code: 'test string',
                name: 'test string',
                __typename: 'Country',
            },
            __typename: 'Institution',
        },
        __typename: 'Card',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
            ],
            providers: [
                CardService,
                MOCK_APOLLO_PROVIDER,
            ],
        });
    });

    AbstractModelServiceSpec.test(CardService, expectedOne, expectedAll, expectedCreate, expectedUpdate);

});
