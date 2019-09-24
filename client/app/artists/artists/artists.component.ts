import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ArtistService } from '../services/artist.service';
import { AbstractList } from '../../shared/components/AbstractList';
import { ArtistComponent } from '../artist/artist.component';

@Component({
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.scss'],

})
export class ArtistsComponent extends AbstractList {

    constructor(service: ArtistService,
                router: Router,
                route: ActivatedRoute,
                dialog: MatDialog) {

        super('artists', service, ArtistComponent, router, route, dialog);
    }

}
