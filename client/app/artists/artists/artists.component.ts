import {Component, inject} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {ArtistComponent} from '../artist/artist.component';
import {ArtistService} from '../services/artist.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltip} from '@angular/material/tooltip';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
} from '@angular/material/table';
import {NaturalFixedButtonComponent, NaturalSearchComponent} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
    selector: 'app-artists',
    imports: [
        MatToolbar,
        LogoComponent,
        NaturalSearchComponent,
        MatTable,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatColumnDef,
        MatCellDef,
        MatRowDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatSort,
        MatSortHeader,
        TableButtonComponent,
        MatTooltip,
        HideTooltipDirective,
        MatProgressSpinner,
        MatPaginator,
        NaturalFixedButtonComponent,
    ],
    templateUrl: './artists.component.html',
    styleUrl: './artists.component.scss',
})
export class ArtistsComponent extends AbstractList<ArtistService> {
    public constructor() {
        super(inject(ArtistService), ArtistComponent);
    }
}
