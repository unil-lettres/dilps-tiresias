import { MapsAPILoader } from '@agm/core';
import { Component, Input, OnInit } from '@angular/core';
import { NaturalAbstractController } from '@ecodev/natural';
import { Cards, Precision } from '../shared/generated-types';
import Icon = google.maps.Icon;
import LatLngBounds = google.maps.LatLngBounds;
import {} from 'googlemaps';

@Component({
    selector: 'app-view-map',
    templateUrl: './view-map.component.html',
    styleUrls: ['./view-map.component.scss'],
})
export class ViewMapComponent extends NaturalAbstractController implements OnInit {

    @Input() cards: Cards;

    public markers;
    public bounds: LatLngBounds;

    constructor(private mapsAPILoader: MapsAPILoader) {
        super();
    }

    public static getIcon(iconName: Precision): Icon {

        return {
            url: 'assets/icons/gmap_' + (iconName || Precision.site) + '.png',
            size: new google.maps.Size(32, 37),
            anchor: new google.maps.Point(16, 37),
        };
    }

    ngOnInit() {

        this.mapsAPILoader.load().then(() => {
            this.markers = this.convertIntoMarkers(this.cards);
            this.updateBounds(this.markers);
        });

    }

    public convertIntoMarkers(cards) {
        return cards.filter(c => c.latitude && c.longitude).map(c => {
            return {
                id: c.id,
                name: c.name,
                latitude: c.latitude,
                longitude: c.longitude,
                icon: ViewMapComponent.getIcon(c.precision),
            };
        });
    }

    public updateBounds(markers) {

        this.bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => {
            this.bounds.extend({lat: marker.latitude, lng: marker.longitude});
        });
    }

}
