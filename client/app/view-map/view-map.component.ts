/// <reference types="@types/googlemaps" />

import {MapsAPILoader} from '@agm/core';
import {Component, EventEmitter, Inject, Input, NgZone, Output} from '@angular/core';
import {NaturalAbstractController} from '@ecodev/natural';
import {Cards_cards_items, Precision, Site} from '../shared/generated-types';
import {SITE} from '../app.config';
import Icon = google.maps.Icon;
import LatLngBounds = google.maps.LatLngBounds;
import ControlPosition = google.maps.ControlPosition;

export interface Location {
    longitude: number;
    latitude: number;
}

type Marker = {
    name: string;
    icon: Icon;
    id: string;
} & Location;

@Component({
    selector: 'app-view-map',
    templateUrl: './view-map.component.html',
    styleUrls: ['./view-map.component.scss'],
})
export class ViewMapComponent extends NaturalAbstractController {
    @Input() set cards(cards: Cards_cards_items[]) {
        this.mapsAPILoader.load().then(() => {
            this.markers = this.convertIntoMarkers(cards);
            this.updateBounds(this.markers);
        });
    }

    @Output() public readonly searchByLocation = new EventEmitter<Location>();

    public markers: Marker[];
    public bounds: LatLngBounds;

    constructor(
        private readonly mapsAPILoader: MapsAPILoader,
        private readonly ngZone: NgZone,
        @Inject(SITE) public readonly site: Site,
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

    public convertIntoMarkers(cards: Cards_cards_items[]): Marker[] {
        return cards
            .filter(c => c.latitude && c.longitude)
            .map(c => {
                return {
                    id: c.id,
                    name: c.name,
                    latitude: c.latitude,
                    longitude: c.longitude,
                    icon: ViewMapComponent.getIcon(c.precision),
                };
            });
    }

    public forwardSearch(marker: Marker): void {
        this.ngZone.run(() => {
            this.searchByLocation.emit({
                longitude: marker.longitude,
                latitude: marker.latitude,
            });
        });
    }

    public updateBounds(markers: Marker[]): void {
        this.bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => {
            this.bounds.extend({lat: marker.latitude, lng: marker.longitude});
        });
    }
}
