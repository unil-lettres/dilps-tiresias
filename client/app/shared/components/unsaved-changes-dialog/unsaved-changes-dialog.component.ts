import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

export type UnsavedChangesDialogResult = 'save' | 'discard' | undefined;

@Component({
    selector: 'app-unsaved-changes-dialog',
    imports: [MatDialogModule, MatButton],
    template: `
        <h2 mat-dialog-title>Vous allez quitter le mode édition</h2>
        <mat-dialog-content>Vos modifications seront perdues si vous ne les enregistrez pas.</mat-dialog-content>
        <mat-dialog-actions align="end">
            <button matButton="outlined" mat-dialog-close>Continuer à éditer</button>
            <button matButton="outlined" color="error" mat-dialog-close="discard">Quitter sans enregistrer</button>
            <button matButton="filled" color="primary" mat-dialog-close="save">Enregistrer et quitter</button>
        </mat-dialog-actions>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsavedChangesDialogComponent {}
