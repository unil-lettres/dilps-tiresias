import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ArtistComponent} from '../../../artists/artist/artist.component';
import {Card_card, Cards_cards_items, CreateExportInput, ExportFormat, Site} from '../../generated-types';
import {FakeCollection} from '../../../collections/services/fake-collection.resolver';
import {ExportService} from '../../../exports/services/export.service';
import {SITE} from '../../../app.config';
import {AlertService} from '../alert/alert.service';
import {MatTabChangeEvent} from '@angular/material/tabs';

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

    constructor(
        private readonly dialogRef: MatDialogRef<ArtistComponent>,
        @Inject(MAT_DIALOG_DATA) data: DownloadComponentData,
        @Inject(SITE) private site: Site,
        private readonly alertService: AlertService,
        private readonly exportService: ExportService,
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
        this.exportService.create(this.input).subscribe(newExport => {
            if (newExport.filename) {
                const url = '/export/' + newExport.filename;
                window.document.location.href = url;
            } else {
                this.alertService.info(
                    'Le download est en cours de préparation. Un email vous sera envoyé quand il sera prêt.',
                    8000,
                );
            }
        });
        this.dialogRef.close();
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
