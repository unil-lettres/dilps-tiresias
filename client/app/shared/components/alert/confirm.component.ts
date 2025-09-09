import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-confirm',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
    public readonly data = inject(MAT_DIALOG_DATA);
}
