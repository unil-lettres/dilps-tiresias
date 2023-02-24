import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ArtistComponent} from '../../../artists/artist/artist.component';
import {Card_card, Cards_cards_items, CreateExportInput, ExportFormat, Site} from '../../generated-types';
import {FakeCollection} from '../../../collections/services/fake-collection.resolver';
import {ExportService} from '../../../exports/services/export.service';
import {SITE} from '../../../app.config';
import {AlertService} from '../alert/alert.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {Apollo} from 'apollo-angular';
import {forkJoin, switchMap, EMPTY, map, defaultIfEmpty, finalize} from 'rxjs';

export type DownloadComponentData = {
    denyLegendsDownload: boolean;
    collections: FakeCollection[];
    cards: (Cards_cards_items | Card_card)[];
};

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss'],
})
export class DownloadComponent {
    public readonly sizes = [
        {
            label: 'maximum',
            value: 0,
        },
        {
            label: 'moyen (1600 x 1200)',
            value: 1200,
        },
        {
            label: 'petit (1024 x 768)',
            value: 768,
        },
    ];

    public validated = false;
    public denyLegendsDownload = false;
    public readonly input: CreateExportInput = this.exportService.getDefaultForServer();
    public validationMessage: string | null = null;
    public readonly pptxLabel = 'PowerPoint';

    public constructor(
        private readonly dialogRef: MatDialogRef<ArtistComponent>,
        @Inject(MAT_DIALOG_DATA) data: DownloadComponentData,
        @Inject(SITE) private readonly site: Site,
        private readonly alertService: AlertService,
        private readonly exportService: ExportService,
        private readonly apollo: Apollo,
    ) {
        this.denyLegendsDownload = data.denyLegendsDownload;
        this.input.includeLegend = !this.denyLegendsDownload;

        this.input.collections.push(...data.collections.map(collection => collection.id));
        this.input.cards.push(...data.cards.map(card => card.id));
    }

    public downloadPowerPoint(): void {
        this.input.format = ExportFormat.pptx;
        this.download();
    }

    public downloadExcel(): void {
        this.input.format = ExportFormat.csv;
        this.download();
    }

    public downloadZip(): void {
        this.input.format = ExportFormat.zip;
        this.download();
    }

    private download(): void {
        // Creating the export causes Apollo.client.reFetchObservableQueries()
        // to be executed, leading to some xhr requests being made. Changing the
        // location of the current page with document.location.href while these
        // requests are pending causes Safari to block their responses because
        // of CORS error (although we're on the same domain). So we wait on
        // these requests to be completed before proceeding to change the
        // location of the page.
        this.exportService
            .create(this.input)
            .pipe(
                switchMap(newExport => {
                    if (newExport.filename) {
                        const observable_queries = this.apollo.client.getObservableQueries();
                        const promises = Array.from(observable_queries.values()).map(q => q.result());
                        const url = '/export/' + newExport.filename;
                        return forkJoin(promises).pipe(
                            map(() => url),
                            defaultIfEmpty(url),
                        );
                    } else {
                        this.alertService.info(
                            'Le download est en cours de préparation. Un email vous sera envoyé quand il sera prêt.',
                            8000,
                        );
                        return EMPTY;
                    }
                }),
                finalize(() => this.dialogRef.close()),
            )
            .subscribe(url => {
                if (url) {
                    window.document.location.href = url;
                }
            });
    }

    public tabChange($event: MatTabChangeEvent): void {
        if (!this.validated && $event.tab.textLabel === this.pptxLabel) {
            this.input.format = ExportFormat.pptx;
            this.exportService.validate(this.input).subscribe(validationMessage => {
                this.validationMessage = validationMessage;
                this.validated = true;
            });
        }
    }
}
