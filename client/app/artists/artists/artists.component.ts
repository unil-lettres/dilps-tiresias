import {Component, Injector} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {ArtistComponent} from '../artist/artist.component';
import {ArtistService} from '../services/artist.service';

@Component({
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent extends AbstractList<ArtistService> {
    constructor(service: ArtistService, injector: Injector) {
        super(service, ArtistComponent, injector);
    }
}
