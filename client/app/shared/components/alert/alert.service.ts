import {Injectable} from '@angular/core';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {
    MatLegacySnackBar as MatSnackBar,
    MatLegacySnackBarRef as MatSnackBarRef,
    LegacySimpleSnackBar as SimpleSnackBar,
} from '@angular/material/legacy-snack-bar';
import {Observable} from 'rxjs';
import {ConfirmComponent} from './confirm.component';

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    public constructor(private readonly dialog: MatDialog, private readonly snackBar: MatSnackBar) {}

    public info(message: string, duration = 1500): MatSnackBarRef<SimpleSnackBar> {
        return this.snackBar.open(message, null, {
            duration: duration,
            verticalPosition: 'top',
            horizontalPosition: 'end',
        });
    }

    public error(message: string, duration = 1500): MatSnackBarRef<SimpleSnackBar> {
        return this.snackBar.open(message, null, {
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
