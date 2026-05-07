import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {NaturalIconDirective} from '@ecodev/natural';

@Component({
    selector: 'app-import-template-dialog',
    imports: [MatDialogModule, MatButton, MatIcon, NaturalIconDirective],
    template: `
        <h2 mat-dialog-title>Comment importer avec métadonnées ?</h2>
        <mat-dialog-content>
            <ol class="nat-vertical nat-gap-10" style="padding-left: 20px">
                <li>Téléchargez le modèle Excel ci-dessous.</li>
                <li>Remplissez-le en renseignant une image par ligne.</li>
                <li>
                    Importez tout ensemble : utilisez l'outil d'ajout d'images (<mat-icon
                        naturalIcon="file_upload"
                        style="vertical-align: middle"
                    />) et faites une <b>sélection multiple</b> pour inclure le fichier Excel <b>et</b> toutes les
                    images correspondantes.
                </li>
            </ol>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-dialog-close matButton="outlined">Fermer</button>
            <a matButton="filled" href="/api/template" mat-dialog-close>
                <mat-icon naturalIcon="table_view" />
                Télécharger le modèle Excel
            </a>
        </mat-dialog-actions>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportTemplateDialogComponent {}
