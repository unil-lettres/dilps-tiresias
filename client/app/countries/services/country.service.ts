import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Countries, Country } from '../../shared/generated-types';

import { AbstractModelService } from '../../shared/services/abstract-model.service';
import { countriesQuery, countryQuery } from './countryQueries';

@Injectable({
    providedIn: 'root'
})
export class CountryService
    extends AbstractModelService<Country['country'],
        Countries['countries'],
        null,
        null,
        null> {

    constructor(apollo: Apollo) {
        super(apollo,
            'country',
            countryQuery,
            countriesQuery,
            null,
            null,
            null);
    }

}
