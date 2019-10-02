import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MOCK_APOLLO_PROVIDER } from '../testing/MOCK_APOLLO_PROVIDER';
import { LinkService } from './link-mutation.service';

describe('LinkService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LinkService,
                MOCK_APOLLO_PROVIDER,
            ],
        });
    });

    const card = {__typename: 'Card'};
    const collection = {__typename: 'Collection'};
    const company = {__typename: 'Company'};

    const expectCollection = {
        id: '456',
        __typename: 'Collection',
    };

    const expectedLink = {
        data: {
            linkCollectionCard: expectCollection,
        },
    };

    const expectedUnlink = {
        data: {
            unlinkCollectionCard: expectCollection,
        },
    };

    it('should be able to link', fakeAsync(inject([LinkService], (service: LinkService) => {
        let actual = null;
        tick();
        service.link(collection, card).subscribe(v => actual = v);
        tick();
        expect(actual).toEqual(expectedLink);
    })));

    it('should be able to link in reverse order', fakeAsync(inject([LinkService], (service: LinkService) => {
        let actual = null;
        tick();
        service.link(collection, card).subscribe(v => actual = v);
        tick();
        expect(actual).toEqual(expectedLink);
    })));

    it('should be able to unlink', fakeAsync(inject([LinkService], (service: LinkService) => {
        let actual = null;
        tick();
        service.unlink(card, collection).subscribe(v => actual = v);
        tick();

        expect(actual).toEqual(expectedUnlink);
    })));

    it('should be able to unlink in reverse order', fakeAsync(inject([LinkService], (service: LinkService) => {
        let actual = null;
        tick();
        service.unlink(collection, card).subscribe(v => actual = v);
        tick();

        expect(actual).toEqual(expectedUnlink);
    })));

    it('should throw for non-existing link mutation', fakeAsync(inject([LinkService], (service: LinkService) => {
        tick();
        expect(() => service.link(card, company).subscribe()).toThrowError('API does not allow to link Company and Card');
        tick();
    })));

    it('should throw for non-existing unlink mutation', fakeAsync(inject([LinkService], (service: LinkService) => {
        tick();
        expect(() => service.unlink(card, company).subscribe()).toThrowError('API does not allow to unlink Company and Card');
        tick();
    })));

});
