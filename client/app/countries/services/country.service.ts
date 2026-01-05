import {Injectable} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {
    CountriesQuery,
    CountriesQueryVariables,
    CountryQuery,
    CountryQueryVariables,
} from '../../shared/generated-types';
import {countriesQuery, countryQuery} from './country.queries';

@Injectable({
    providedIn: 'root',
})
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
