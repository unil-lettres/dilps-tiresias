import { inject, TestBed } from '@angular/core/testing';

import { AddressService } from './address.service';

describe('AddressService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AddressService],
        });
    });

    it('should be created', inject([AddressService], (service: AddressService) => {
        expect(service).toBeTruthy();
    }));
});
