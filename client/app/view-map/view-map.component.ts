import {Component, inject, NgZone, viewChild, ChangeDetectionStrategy} from '@angular/core';
import {type CardsQuery, Precision, Site} from '../shared/generated-types';
import {CardService} from '../card/services/card.service';
import {SITE} from '../app.config';
import {MapApiService} from './map-api.service';
import {groupByLocation, type Location} from './view-map.utils';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';
import {MatButton} from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import {RouterLink} from '@angular/router';
import Icon = google.maps.Icon;

export type {Location} from './view-map.utils';

type MarkerCard = {
    id: string;
    name: string;
    imageSrc: string;
};

/**
 * A single marker for all the cards a few meters away, because the markers would hide each other
 */
type Marker = {
    icon: Icon;
    cards: MarkerCard[];
} & Location;

type Card = CardsQuery['cards']['items'][0];

export type ViewMapData = {
    cards: Card[];
};

export function isLocated(card: Card): boolean {
    return !!card.latitude && !!card.longitude;
}

/**
 * Show the given cards on a map, and return the location around which the user wants to search, if any
 */
@Component({
    selector: 'app-view-map',
    imports: [
        GoogleMap,
        MapInfoWindow,
        MapMarker,
        RouterLink,
        MatButton,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
    ],
    templateUrl: './view-map.component.html',
    styleUrl: './view-map.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {class: 'nat-vertical'},
})
export class ViewMapComponent {
    protected readonly mapApiService = inject(MapApiService);
    private readonly ngZone = inject(NgZone);
    private readonly site = inject(SITE);

    private readonly dialogRef = inject<MatDialogRef<ViewMapComponent, Location>>(MatDialogRef);
    protected readonly cards = inject<ViewMapData>(MAT_DIALOG_DATA).cards;
    protected readonly locatedCount = this.cards.filter(isLocated).length;

    protected selectedMarker: Marker | null = null;

    private readonly map = viewChild(GoogleMap);
    private readonly infoWindow = viewChild(MapInfoWindow);
    protected readonly infoWindowOption: google.maps.InfoWindowOptions = {
        maxWidth: 400,
        headerDisabled: true,
    };
    protected markers: Marker[] | null = null;
    protected readonly mapOptions: google.maps.MapOptions = {
        mapTypeId: this.site === Site.Dilps ? 'roadmap' : 'satellite',
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: true,
        streetViewControl: true,
        mapTypeControlOptions: {position: 10.0},
    };

    public constructor() {
        this.mapApiService.loaded.subscribe(() => {
            this.markers = this.convertIntoMarkers(this.cards);
            this.updateBounds(this.markers);
        });
    }

    public static getIcon(precision: Precision): Icon {
        const iconName = {
            [Precision.Site]: 'site',
            [Precision.Building]: 'building',
            [Precision.Locality]: 'locality',
        }[precision || Precision.Site];

        return {
            url: `assets/icons/gmap_${iconName}.png`,
            size: new google.maps.Size(32, 37),
            anchor: new google.maps.Point(16, 37),
        };
    }

    protected convertIntoMarkers(cards: CardsQuery['cards']['items'][0][]): Marker[] {
        const groups = groupByLocation(
            cards.filter(isLocated),
            c => ({latitude: c.latitude!, longitude: c.longitude!}),
            5,
        );

        return groups.map(group => {
            const [first] = group;

            return {
                latitude: first.latitude!,
                longitude: first.longitude!,
                icon: ViewMapComponent.getIcon(first.precision!),
                cards: group.map(c => ({
                    id: c.id,
                    name: c.plainName || c.code || 'Fiche sans titre',
                    imageSrc: CardService.getImageLink(c, 300)!,
                })),
            };
        });
    }

    protected forwardSearch(marker: Marker | null): void {
        if (!marker) {
            return;
        }

        this.ngZone.run(() => {
            this.dialogRef.close({
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
                this.map()?.fitBounds(bounds, {
                    top: 250,
                    right: 100,
                    left: 100,
                    bottom: 10,
                });
            }),
        );
    }

    protected closeInfoWindow(): void {
        this.infoWindow()?.close();
    }

    protected openInfoWindow(mapMarker: MapMarker, marker: Marker): void {
        this.selectedMarker = marker;
        this.infoWindow()?.open(mapMarker);
    }
}
