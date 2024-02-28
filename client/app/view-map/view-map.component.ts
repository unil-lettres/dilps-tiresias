import {Component, EventEmitter, Inject, Input, NgZone, Output, ViewChild} from '@angular/core';
import {NaturalAbstractController} from '@ecodev/natural';
import {Cards, Precision, Site} from '../shared/generated-types';
import {CardService} from '../card/services/card.service';
import {SITE} from '../app.config';
import {MapApiService} from './map-api.service';
import {GoogleMap, MapInfoWindow, MapMarker, GoogleMapsModule} from '@angular/google-maps';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

import Icon = google.maps.Icon;

export interface Location {
    longitude: number;
    latitude: number;
}

type Marker = {
    name: string;
    icon: Icon;
    id: string;
    imageSrc: string;
} & Location;

@Component({
    selector: 'app-view-map',
    templateUrl: './view-map.component.html',
    styleUrls: ['./view-map.component.scss'],
    standalone: true,
    imports: [GoogleMapsModule, FlexModule, RouterLink, MatButtonModule],
})
export class ViewMapComponent extends NaturalAbstractController {
    public selectedMarker: Marker | null = null;

    @Input({required: true})
    public set cards(cards: Cards['cards']['items'][0][]) {
        this.mapApiService.loaded.subscribe(() => {
            this.markers = this.convertIntoMarkers(cards);
            this.updateBounds(this.markers);
        });
    }

    @Output() public readonly searchByLocation = new EventEmitter<Location>();
    @ViewChild(GoogleMap) private map!: GoogleMap;
    @ViewChild(MapInfoWindow) private infoWindow!: MapInfoWindow;
    public readonly infoWindowOption: google.maps.InfoWindowOptions = {
        maxWidth: 400,
    };
    public markers: Marker[] | null = null;
    public readonly mapOptions: google.maps.MapOptions = {
        mapTypeId: this.site === 'dilps' ? 'roadmap' : 'satellite',
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: true,
        streetViewControl: true,
        mapTypeControlOptions: {position: 10.0},
    };

    public constructor(
        public readonly mapApiService: MapApiService,
        private readonly ngZone: NgZone,
        @Inject(SITE) private readonly site: Site,
    ) {
        super();
    }

    public static getIcon(iconName: Precision): Icon {
        return {
            url: 'assets/icons/gmap_' + (iconName || Precision.site) + '.png',
            size: new google.maps.Size(32, 37),
            anchor: new google.maps.Point(16, 37),
        };
    }

    public convertIntoMarkers(cards: Cards['cards']['items'][0][]): Marker[] {
        return cards
            .filter(c => c.latitude && c.longitude)
            .map(c => {
                return {
                    id: c.id,
                    name: c.name,
                    latitude: c.latitude!,
                    longitude: c.longitude!,
                    icon: ViewMapComponent.getIcon(c.precision!),
                    imageSrc: CardService.getImageLink(c, 200)!,
                };
            });
    }

    public forwardSearch(marker: Marker | null): void {
        if (!marker) {
            return;
        }

        this.ngZone.run(() => {
            this.searchByLocation.emit({
                longitude: marker.longitude,
                latitude: marker.latitude,
            });
        });
    }

    private updateBounds(markers: Marker[]): void {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => {
            bounds.extend({lat: marker.latitude, lng: marker.longitude});
        });

        this.mapApiService.loaded.subscribe(() =>
            setTimeout(() => {
                this.map.fitBounds(bounds, {
                    top: 250,
                    right: 100,
                    left: 100,
                    bottom: 10,
                });
            }),
        );
    }

    public openInfoWindow(mapMarker: MapMarker, marker: Marker): void {
        this.selectedMarker = marker;
        this.infoWindow.open(mapMarker);
    }
}
