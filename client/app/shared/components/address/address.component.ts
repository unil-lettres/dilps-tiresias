import { AgmMap, MapsAPILoader, MapTypeStyle } from '@agm/core';
import {
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    Inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
// Format can remove following line, that is required to prevent warnings in console
import { merge } from 'lodash';
import { CountryService } from '../../../countries/services/country.service';
import { Countries, CountriesVariables, Site } from '../../generated-types';
import { AddressService } from './address.service';
import { SITE } from '../../../app.config';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
    providers: [
        AddressService,
        CountryService,
    ],
})
export class AddressComponent implements OnInit, OnChanges {

    @ViewChild('input', {static: true}) public inputRef: ElementRef;

    /**
     * If true, layouts vertically some side by side elements
     */
    @Input() vertical = false;

    /**
     * Prevents fields edition
     */
    @Input() readonly = false;

    /**
     * If Dilps mode, show everything, otherwise hide some stuff for Tiresias
     */
    @Input() isDilps = true;

    /**
     * Object reference is directly modified
     */
    @Input() model;

    public formCtrl = new FormControl();

    public latitude = 44.5918711;
    public longitude = 4.7176318;
    public zoom = 2;

    public icon;

    @ViewChild(AgmMap, {static: false}) public map: AgmMap;

    public mapStyles: MapTypeStyle[] = [
        {
            elementType: 'geometry',
            stylers: [
                {
                    color: '#f5f5f5',
                },
            ],
        },
        {
            elementType: 'labels.icon',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#3c8bc7',
                },
            ],
        },
        {
            elementType: 'labels.text.stroke',
            stylers: [
                {
                    color: '#f5f5f5',
                },
            ],
        },
        {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#bdbdbd',
                },
            ],
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#eeeeee',
                },
            ],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#3c8bc7',
                },
            ],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#e5e5e5',
                },
            ],
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#9e9e9e',
                },
            ],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#ffffff',
                },
            ],
        },
        {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#757575',
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#dadada',
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#616161',
                },
            ],
        },
        {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#9e9e9e',
                },
            ],
        },
        {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#e5e5e5',
                },
            ],
        },
        {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#eeeeee',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#3c8bc7',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#9e9e9e',
                },
            ],
        },
    ];
    public countries: Countries['countries']['items'];
    private autocomplete;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private addressService: AddressService,
        private countryService: CountryService,
        @Inject(SITE) public readonly site: Site,
    ) {
    }

    ngOnInit() {

        const qvm = new NaturalQueryVariablesManager<CountriesVariables>();
        qvm.set('pagination', {pagination: {pageSize: 9999}});

        this.countryService.getAll(qvm).subscribe(countries => this.countries = countries.items);

        if (this.model && this.model.latitude && this.model.longitude) {
            this.latitude = +this.model.latitude;
            this.longitude = +this.model.longitude;
            this.zoom = 12;
        }

        // load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            this.icon = this.getIcon();
            this.autocomplete = new google.maps.places.Autocomplete(this.inputRef.nativeElement);
            this.autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    this.onPlaceChange();
                });
            });
        });

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (this.model) {
            this.latitude = +this.model.latitude;
            this.longitude = +this.model.longitude;
        }
    }

    public updateSearch() {
        const address = this.getAddressAsString();
        this.formCtrl.setValue(address);
    }

    public search() {
        this.updateSearch();
        this.inputRef.nativeElement.focus(); // focus in input to open google suggestions
    }

    public onPlaceChange() {

        const place: google.maps.places.PlaceResult = this.autocomplete.getPlace();

        // verify result
        if (place.geometry === undefined || place.geometry === null) {
            return;
        }

        // set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.zoom = 15;

        merge(this.model, this.addressService.buildAddress(place));
    }

    public onMarkerDrag(ev) {
        this.latitude = ev.coords.lat;
        this.longitude = ev.coords.lng;

        this.model.latitude = this.latitude;
        this.model.longitude = this.longitude;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            location: {
                lat: ev.coords.lat,
                lng: ev.coords.lng,
            },
        }, (places) => {
            const address = this.addressService.buildAddress(places[0]) as any;
            merge(this.model, address);
            this.model.country = this.countries.find(c => c.code === address.countryIso2); // change reference
            this.updateSearch();
        });

    }

    public getIcon(color = '#ff9800') {

        const iconSize = 48;
        const icon: any = {
            path: 'M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 ' +
                '19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1,
        };

        icon.size = new google.maps.Size(iconSize, iconSize);
        icon.anchor = new google.maps.Point(iconSize / 2, iconSize);
        icon.fillColor = color;

        return icon;
    }

    private getAddressAsString() {
        const address = [
            this.model.street,
            this.model.postcode,
            this.model.locality,
            this.model.country ? this.model.country.name : this.model.country,
        ];
        return address.filter(v => !!v).join(', ');
    }

    public recenter() {
        this.latitude = +this.model.latitude;
        this.longitude = +this.model.longitude;
    }

}
