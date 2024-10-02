import {Injectable, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {ConfirmComponent} from './confirm.component';

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);

    public info(message: string, duration = 1500): MatSnackBarRef<SimpleSnackBar> {
        return this.snackBar.open(message, undefined, {
            duration: duration,
            verticalPosition: 'top',
            horizontalPosition: 'end',
        });
    }

    public error(message: string, duration = 1500): MatSnackBarRef<SimpleSnackBar> {
        return this.snackBar.open(message, undefined, {
            duration: duration,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top',
            horizontalPosition: 'end',
        });
    }

    public confirm(title: string, message: string, confirmText: string, cancelText = 'Annuler'): Observable<any> {
        const dialog = this.dialog.open(ConfirmComponent, {
            data: {
                title: title,
                message: message,
                confirmText: confirmText,
                cancelText: cancelText,
            },
        });

        return dialog.afterClosed();
    }
}
