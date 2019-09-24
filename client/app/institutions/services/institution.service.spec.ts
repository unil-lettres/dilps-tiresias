import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AbstractModelServiceSpec } from '../../shared/testing/AbstractModelServiceSpec';
import { MOCK_APOLLO_PROVIDER } from '../../shared/testing/MOCK_APOLLO_PROVIDER';
import { userMetaTesting } from '../../shared/testing/userMetaTesting';
import { InstitutionService } from './institution.service';

describe('InstitutionService', () => {

    const expectedOne = {
        id: '456',
        name: 'test string',
        locality: 'test string',
        street: 'test string',
        postcode: 'test string',
        latitude: 0.5,
        longitude: 0.5,
        country: {
            id: '456',
            code: 'test string',
            name: 'test string',
            __typename: 'Country',
        },
        __typename: 'Institution',
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
        locality: 'test string',
        __typename: 'Institution',
    };

    const expectedAll = {
        items: [
            expectedOneForAll,
            expectedOneForAll,
        ],
        pageSize: 1,
        pageIndex: 1,
        length: 1,
        __typename: 'InstitutionPagination',
    };

    const expectedCreate = {
        id: '456',
        creationDate: '2018-01-18T11:43:31',
        creator: userMetaTesting,
        __typename: 'Institution',
    };

    const expectedUpdate = {
        id: 123,
        updateDate: '2018-01-18T11:43:31',
        updater: userMetaTesting,
        __typename: 'Institution',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
            ],
            providers: [
                InstitutionService,
                MOCK_APOLLO_PROVIDER,
            ],
        });
    });

    AbstractModelServiceSpec.test(InstitutionService, expectedOne, expectedAll, expectedCreate, expectedUpdate);

});
