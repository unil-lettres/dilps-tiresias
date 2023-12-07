import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NaturalIconDirective} from '@ecodev/natural';
import {Cards, ExportFormat} from '../../generated-types';
import {ExportService} from 'client/app/exports/services/export.service';
import {EMPTY, switchMap} from 'rxjs';
import {waitOnApolloQueries} from '../../services/utility';
import {Apollo} from 'apollo-angular';
import {AlertService} from '../alert/alert.service';

@Component({
    selector: 'app-export-menu',
    templateUrl: './export-menu.component.html',
    styleUrls: ['./export-menu.component.scss'],
    standalone: true,
    imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule, NaturalIconDirective],
})
export class ExportMenuComponent {
    @Input()
    public showExcelExportation = true;

    @Input({required: true})
    public selectedCards: Cards['cards']['items'][0][] = [];

    public ExportFormat = ExportFormat;

    public constructor(
        private readonly exportService: ExportService,
        private readonly alertService: AlertService,
        private readonly apollo: Apollo,
    ) {}

    public export(format: ExportFormat): void {
        const input = this.exportService.getDefaultForServer();
        input.cards.push(...this.selectedCards.map(card => card.id));
        input.format = format;
        this.exportService
            .create(input)
            .pipe(
                switchMap(newExport => {
                    if (newExport.filename) {
                        const url = '/export/' + newExport.filename;

                        // Safari blocks the download of the file if the
                        // location of the page is changed while xhr requests
                        // are pending.
                        return waitOnApolloQueries<string>(this.apollo, url);
                    } else {
                        this.alertService.info(
                            "L'exportation est en cours de préparation. Un email vous sera envoyé quand il sera prêt.",
                            8000,
                        );
                        return EMPTY;
                    }
                }),
            )
            .subscribe(url => {
                if (url) {
                    window.document.location.href = url;
                }
            });
    }
}