import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NaturalIconDirective} from '@ecodev/natural';
import {Card, Cards, CreateExportInput, ExportFormat} from '../../generated-types';
import {ExportService} from 'client/app/exports/services/export.service';
import {EMPTY, finalize, switchMap} from 'rxjs';
import {waitOnApolloQueries} from '../../services/utility';
import {Apollo} from 'apollo-angular';
import {AlertService} from '../alert/alert.service';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatTooltipModule} from '@angular/material/tooltip';

export type DownloadComponentData = {
    showExcelExportation: boolean;
    cards: (Cards['cards']['items'][0] | Card['card'])[];
};

@Component({
    selector: 'app-export-dialog',
    templateUrl: './export-dialog.component.html',
    styleUrls: ['./export-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        NaturalIconDirective,
        MatDialogModule,
        MatTooltipModule,
    ],
})
export class ExportDialogComponent {
    public ExportFormat = ExportFormat;

    public pptValidationMessage: string | null = null;

    public constructor(
        private readonly dialogRef: MatDialogRef<ExportDialogComponent>,
        private readonly exportService: ExportService,
        private readonly alertService: AlertService,
        private readonly apollo: Apollo,
        @Inject(MAT_DIALOG_DATA) public readonly data: DownloadComponentData,
    ) {
        this.pptValidationMessage = 'Validation...';

        const input = this.exportService.getDefaultForServer();
        input.cards.push(...this.data.cards.map(card => card.id));
        input.format = ExportFormat.pptx;

        this.exportService
            .validate(input)
            .pipe(takeUntilDestroyed())
            .subscribe(validationMessage => {
                this.pptValidationMessage = validationMessage;
            });
    }

    public export(format: ExportFormat): void {
        const input = this.exportService.getDefaultForServer();
        input.cards.push(...this.data.cards.map(card => card.id));
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
                finalize(() => {
                    this.dialogRef.close();
                }),
            )
            .subscribe(url => {
                if (url) {
                    window.document.location.href = url;
                }
            });
    }
}
