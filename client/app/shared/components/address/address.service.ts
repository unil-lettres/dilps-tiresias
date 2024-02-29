import {Injectable} from '@angular/core';
import {isUndefined, mapValues, trim} from 'lodash-es';

export type Address = {
    street?: string;
    postcode?: string;
    locality?: string;
    area?: string;
    countryIso2?: string;
    latitude?: number;
    longitude?: number;
};

type PlaceModel =
    | Pick<google.maps.places.PlaceResult, 'address_components' | 'geometry'>
    | Pick<google.maps.GeocoderResult, 'address_components' | 'geometry'>;

type Config = Record<string, keyof Pick<google.maps.GeocoderAddressComponent, 'long_name' | 'short_name'>>;

@Injectable({
    providedIn: 'root',
})
export class AddressService {
    /**
     * Binds gmap semantic with string we should retrieve
     */
    private config: Config = {
        route: 'long_name',
        street_number: 'short_name',
        postal_code: 'short_name',
        locality: 'long_name',
        country: 'short_name',
    };

    public buildAddress(place: PlaceModel, withLatLon = true): Address {
        const tmpGAddress: Record<string, string> = mapValues(this.config, () => '');

        place.address_components?.forEach(addressComponent => {
            const addressType = addressComponent.types[0];
            if (!isUndefined(this.config[addressType])) {
                tmpGAddress[addressType] = addressComponent[this.config[addressType]];
            }
        });

        const address: Address = {
            street: trim(tmpGAddress.route + ' ' + tmpGAddress.street_number),
            postcode: tmpGAddress.postal_code,
            locality: tmpGAddress.locality,
            countryIso2: tmpGAddress.country,
        };

        if (withLatLon) {
            address.latitude = place.geometry!.location!.lat();
            address.longitude = place.geometry!.location!.lng();
        }

        return address;
    }
}
