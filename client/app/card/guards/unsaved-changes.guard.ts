import {inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CanDeactivateFn} from '@angular/router';
import {of, switchMap} from 'rxjs';
import {CardComponent} from '../card.component';
import {
    UnsavedChangesDialogComponent,
    UnsavedChangesDialogResult,
} from '../../shared/components/unsaved-changes-dialog/unsaved-changes-dialog.component';

export const canDeactivateCard: CanDeactivateFn<CardComponent> = component => {
    if (!component.edit) {
        return true;
    }

    const dialog = inject(MatDialog);

    return dialog
        .open<UnsavedChangesDialogComponent, undefined, UnsavedChangesDialogResult>(UnsavedChangesDialogComponent)
        .afterClosed()
        .pipe(
            switchMap(result => {
                if (result === 'save') {
                    return component.save();
                }
                if (result === 'discard') {
                    component.discardChanges();
                    return of(true);
                }
                return of(false);
            }),
        );
};
