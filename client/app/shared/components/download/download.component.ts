import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {ArtistComponent} from '../../../artists/artist/artist.component';
import {Card, Cards, CreateExportInput, ExportFormat, Site} from '../../generated-types';
import {FakeCollection} from '../../../collections/services/fake-collection.resolver';
import {ExportService} from '../../../exports/services/export.service';
import {SITE} from '../../../app.config';
import {AlertService} from '../alert/alert.service';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import {Apollo} from 'apollo-angular';
import {defaultIfEmpty, EMPTY, finalize, forkJoin, map, switchMap} from 'rxjs';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatOptionModule} from '@angular/material/core';
import {CommonModule} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

export type DownloadComponentData = {
    denyLegendsDownload: boolean;
    collections: FakeCollection[];
    cards: (Cards['cards']['items'][0] | Card['card'])[];
};

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatTabsModule,
        FlexModule,
        MatFormFieldModule,
        MatSelectModule,
        CommonModule,
        MatOptionModule,
        MatCheckboxModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
    ],
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

    public loading = false;
    public validated = false;
    public denyLegendsDownload = false;
    public readonly input: Required<CreateExportInput> = this.exportService.getDefaultForServer();
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
        this.loading = true;
        this.exportService
            .create(this.input)
            .pipe(
                switchMap(newExport => {
                    if (newExport.filename) {
                        const observableQueries = this.apollo.client.getObservableQueries();
                        const promises = Array.from(observableQueries.values()).map(q => q.result());
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
                finalize(() => {
                    this.loading = false;
                    this.dialogRef.close();
                }),
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
