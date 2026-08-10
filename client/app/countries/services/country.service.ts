import {Service} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {
    type CountriesQuery,
    type CountriesQueryVariables,
    type CountryQuery,
    type CountryQueryVariables,
} from '../../shared/generated-types';
import {countriesQuery, countryQuery} from './country.queries';

@Service()
export class CountryService extends NaturalAbstractModelService<
    CountryQuery['country'],
    CountryQueryVariables,
    CountriesQuery['countries'],
    CountriesQueryVariables,
    null,
    never,
    null,
    never,
    null,
    never
> {
    public constructor() {
        super('country', countryQuery, countriesQuery, null, null, null);
    }
}
