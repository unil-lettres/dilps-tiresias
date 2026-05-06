import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatDivider} from '@angular/material/divider';
import {ChangeDetectionStrategy} from '@angular/core';
import {GraphQLFormattedError} from 'graphql';

@Component({
    selector: 'app-errors-dialog',
    imports: [MatDialogModule, MatButton, MatDivider],
    template: `
        <h2 mat-dialog-title>Erreurs serveur</h2>
        <mat-dialog-content>
            <div class="nat-vertical nat-gap">
                @for (error of data; track error) {
                    <div class="nat-vertical" style="user-select: text">
                        @if (error.message) {
                            <span class="mat-body-2">{{ error.message }}</span>
                        }
                        @if (error.extensions?.['debugMessage']) {
                            <span class="mat-body-2">{{ error.extensions?.['debugMessage'] }}</span>
                        }
                    </div>
                    @if (!$last) {
                        <mat-divider />
                    }
                }
            </div>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button matButton="outlined" mat-dialog-close>Fermer</button>
            <button matButton="filled" [mat-dialog-close]="true">Effacer et fermer</button>
        </mat-dialog-actions>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorsDialogComponent {
    protected readonly data = inject<GraphQLFormattedError[]>(MAT_DIALOG_DATA);
}
