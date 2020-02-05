import { Component, Injector } from '@angular/core';
import { Sorting, SortingOrder } from '@ecodev/natural';
import { AbstractList } from '../../shared/components/AbstractList';
import { Artists, ArtistSortingField, ArtistsVariables } from '../../shared/generated-types';
import { ArtistComponent } from '../artist/artist.component';
import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.scss'],

})
export class ArtistsComponent extends AbstractList<Artists['artists'], ArtistsVariables> {

    protected defaultSorting: Array<Sorting> = [{field: ArtistSortingField.name, order: SortingOrder.ASC}];

    constructor(service: ArtistService, injector: Injector) {
        super(service, ArtistComponent, injector);
    }

}
