import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-confirm',
    imports: [MatDialogModule, MatButton],
    templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
    protected readonly data = inject(MAT_DIALOG_DATA);
}
