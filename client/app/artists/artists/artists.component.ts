import {Component} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {ArtistComponent} from '../artist/artist.component';
import {ArtistService} from '../services/artist.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

import {NaturalSearchComponent, NaturalFixedButtonComponent} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';

import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrl: './artists.component.scss',
    standalone: true,
    imports: [
        MatToolbarModule,
        LogoComponent,
        NaturalSearchComponent,
        MatTableModule,
        MatSortModule,
        TableButtonComponent,
        MatTooltipModule,
        HideTooltipDirective,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalFixedButtonComponent,
    ],
})
export class ArtistsComponent extends AbstractList<ArtistService> {
    public constructor(service: ArtistService) {
        super(service, ArtistComponent);
    }
}
