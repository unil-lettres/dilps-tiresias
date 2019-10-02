import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LinkService } from '../../shared/services/link-mutation.service';
import { AbstractModelServiceSpec } from '../../shared/testing/AbstractModelServiceSpec';
import { DummyServices } from '../../shared/testing/DummyServices';
import { MOCK_APOLLO_PROVIDER } from '../../shared/testing/MOCK_APOLLO_PROVIDER';
import { userMetaTesting } from '../../shared/testing/userMetaTesting';
import { CollectionService } from './collection.service';

describe('CollectionService', () => {

    const expectedOne = {
        id: '456',
        name: 'test string',
        description: 'test string',
        isSource: true,
        sorting: 1,
        visibility: 'private',
        institution: {
            id: '456',
            name: 'test string',
            __typename: 'Institution',
        },
        __typename: 'Collection',
        creationDate: '2018-01-18T11:43:31',
        creator: userMetaTesting,
        updateDate: '2018-01-18T11:43:31',
        updater: userMetaTesting,
        permissions: {
            update: true,
            delete: true,
            __typename: 'Permissions',
        },
    };

    const expectedOneForAll = {
        id: '456',
        name: 'test string',

        children: [
            {
                id: '456',
                name: 'test string',
                children: [
                    {
                        id: '456',
                        name: 'test string',
                        children: [
                            {
                                id: '456',
                                name: 'test string',
                                children: [
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
                                __typename: 'Collection',
                            },
                            {
                                id: '456',
                                name: 'test string',
                                children: [
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
                                __typename: 'Collection',
                            },
                        ],
                        __typename: 'Collection',
                    },
                    {
                        id: '456',
                        name: 'test string',
                        children: [
                            {
                                id: '456',
                                name: 'test string',
                                children: [
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
                                __typename: 'Collection',
                            },
                            {
                                id: '456',
                                name: 'test string',
                                children: [
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
                                __typename: 'Collection',
                            },
                        ],
                        __typename: 'Collection',
                    },
                ],
                __typename: 'Collection',
            },
            {
                id: '456',
                name: 'test string',
                children: [
                    {
                        id: '456',
                        name: 'test string',
                        children: [
                            {
                                id: '456',
                                name: 'test string',
                                children: [
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
                                __typename: 'Collection',
                            },
                            {
                                id: '456',
                                name: 'test string',
                                children: [
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
                                __typename: 'Collection',
                            },
                        ],
                        __typename: 'Collection',
                    },
                    {
                        id: '456',
                        name: 'test string',
                        children: [
                            {
                                id: '456',
                                name: 'test string',
                                children: [
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
                                __typename: 'Collection',
                            },
                            {
                                id: '456',
                                name: 'test string',
                                children: [
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
                                __typename: 'Collection',
                            },
                        ],
                        __typename: 'Collection',
                    },
                ],
                __typename: 'Collection',
            },
        ],
        __typename: 'Collection',
    };

    const expectedAll = {
        items: [
            expectedOneForAll,
            expectedOneForAll,
        ],
        pageSize: 1,
        pageIndex: 1,
        length: 1,
        __typename: 'CollectionPagination',
    };

    const expectedCreate = {
        id: '456',
        creationDate: '2018-01-18T11:43:31',
        creator: userMetaTesting,
        __typename: 'Collection',
    };

    const expectedUpdate = {
        id: 123,
        updateDate: '2018-01-18T11:43:31',
        updater: userMetaTesting,
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
        __typename: 'Collection',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
            ],
            providers: [
                CollectionService,
                MOCK_APOLLO_PROVIDER,
                {
                    provide: LinkService,
                    class: DummyServices,
                },
            ],
        });
    });

    AbstractModelServiceSpec.test(CollectionService, expectedOne, expectedAll, expectedCreate, expectedUpdate);

});
