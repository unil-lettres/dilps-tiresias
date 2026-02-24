import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

export type ConfirmData = {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    confirmButtonColor?: 'primary' | 'accent' | 'warn';
    confirmButtonType?: 'elevated' | 'outlined' | 'filled';
};

@Component({
    selector: 'app-confirm',
    imports: [MatDialogModule, MatButton],
    templateUrl: './confirm.component.html',
    styleUrl: './confirm.component.scss',
})
export class ConfirmComponent {
    protected readonly data = inject<ConfirmData>(MAT_DIALOG_DATA);
}
