import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CountriesQuery, CountryQuery } from '../../shared/generated-types';

import { AbstractModelService } from '../../shared/services/abstract-model.service';
import { countriesQuery, countryQuery } from './countryQueries';

@Injectable({
    providedIn: 'root'
})
export class CountryService
    extends AbstractModelService<CountryQuery['country'],
        CountriesQuery['countries'],
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
