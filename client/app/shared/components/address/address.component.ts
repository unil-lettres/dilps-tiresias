import {Component, ElementRef, Inject, Input, NgZone, OnChanges, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    NaturalIconDirective,
    NaturalQueryVariablesManager,
    NaturalSelectComponent,
    NaturalSelectEnumComponent,
} from '@ecodev/natural';
// Format can remove following line, that is required to prevent warnings in console
import {merge} from 'lodash-es';
import {CountryService} from '../../../countries/services/country.service';
import {Card, CardInput, Countries, CountriesVariables, Institution, Site} from '../../generated-types';
import {AddressService} from './address.service';
import {SITE} from '../../../app.config';
import {MapApiService} from '../../../view-map/map-api.service';
import {GoogleMapsModule} from '@angular/google-maps';
import {MatIconModule} from '@angular/material/icon';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrl: './address.component.scss',
    providers: [AddressService, CountryService],
    standalone: true,
    imports: [
        CommonModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ExtendedModule,
        NaturalSelectComponent,
        NaturalSelectEnumComponent,
        CdkAccordionModule,
        MatIconModule,
        ReactiveFormsModule,
        GoogleMapsModule,
        NaturalIconDirective,
    ],
})
export class AddressComponent implements OnInit, OnChanges {
    @ViewChild('input', {static: true}) public inputRef!: ElementRef<HTMLInputElement>;

    /**
     * If true, layouts vertically some side by side elements
     */
    @Input() public vertical = false;

    /**
     * Prevents fields edition
     */
    @Input() public readonly = false;

    /**
     * If Dilps mode, show everything, otherwise hide some stuff for Tiresias
     */
    @Input() public isDilps = true;

    /**
     * Only display map and not adresse informations.
     */
    @Input() public onlyMap = false;

    /**
     * Use an accordion to allow to expand or close the map.
     */
    @Input() public allowExpandableMap = false;

    /**
     * Object reference is directly modified
     */
    @Input() public model: Card['card'] | Institution['institution'] | Card['card']['institution'] | CardInput | null =
        null;

    public formCtrl = new FormControl();

    public latitude = 44.5918711;
    public longitude = 4.7176318;
    public zoom = 2;

    public icon: google.maps.Symbol | null = null;
    public readonly mapOptions: google.maps.MapOptions = {
        mapTypeId: this.site === Site.dilps ? 'roadmap' : 'satellite',
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
        streetViewControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: 11,
        },
        styles: [
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
        ],
    };
    public countries: Countries['countries']['items'][0][] = [];
    private autocomplete: google.maps.places.Autocomplete | null = null;

    public constructor(
        public readonly mapApiService: MapApiService,
        private readonly ngZone: NgZone,
        private readonly addressService: AddressService,
        public readonly countryService: CountryService,
        @Inject(SITE) private readonly site: Site,
    ) {}

    public ngOnChanges(): void {
        if (this.model) {
            this.latitude = +this.model.latitude!;
            this.longitude = +this.model.longitude!;
        }
    }

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<CountriesVariables>();
        qvm.set('pagination', {pagination: {pageSize: 9999}});

        this.countryService.getAll(qvm).subscribe(countries => (this.countries = countries.items));

        if (this.model?.latitude && this.model.longitude) {
            this.latitude = +this.model.latitude;
            this.longitude = +this.model.longitude;
            this.zoom = 12;
        }

        // load Places Autocomplete
        this.mapApiService.loaded.subscribe(() => {
            this.icon = this.getIcon();
            this.autocomplete = new google.maps.places.Autocomplete(this.inputRef.nativeElement);
            this.autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    this.onPlaceChange();
                });
            });
        });
    }

    public updateSearch(): void {
        const address = this.getAddressAsString();
        this.formCtrl.setValue(address);
    }

    public search(): void {
        this.updateSearch();
        this.inputRef.nativeElement.focus(); // focus in input to open google suggestions
    }

    public onPlaceChange(): void {
        const place: google.maps.places.PlaceResult = this.autocomplete!.getPlace();

        // verify result
        if (place.geometry === undefined || place.geometry === null) {
            return;
        }

        // set latitude, longitude and zoom
        this.latitude = place.geometry.location!.lat();
        this.longitude = place.geometry.location!.lng();
        this.zoom = 15;

        merge(this.model, this.addressService.buildAddress(place));
    }

    public onMarkerDrag(ev: google.maps.MapMouseEvent): void {
        this.latitude = ev.latLng!.lat();
        this.longitude = ev.latLng!.lng();

        this.model!.latitude = this.latitude;
        this.model!.longitude = this.longitude;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
            {
                location: {
                    lat: this.latitude,
                    lng: this.longitude,
                },
            },
            places => {
                const address = this.addressService.buildAddress(places![0], false);
                merge(this.model, address);
                this.model!.country = this.countries.find(c => c.code === address.countryIso2); // change reference
                this.updateSearch();
            },
        );
    }

    private getIcon(color = '#ff9800'): google.maps.Symbol {
        const iconSize = 48;
        const icon: google.maps.Symbol = {
            path:
                'M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 ' +
                '19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1,
        };

        icon.anchor = new google.maps.Point(iconSize / 2, iconSize);
        icon.fillColor = color;

        return icon;
    }

    private getAddressAsString(): string {
        const address = [
            this.model!.street,
            this.model!.postcode,
            this.model!.locality,
            this.model!.country ? this.model!.country.name : this.model!.country,
        ];
        return address.filter(v => !!v).join(', ');
    }

    public recenter(): void {
        this.latitude = +this.model!.latitude!;
        this.longitude = +this.model!.longitude!;
    }
}
