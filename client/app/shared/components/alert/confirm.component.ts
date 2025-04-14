import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmComponent {
    public readonly data = inject(MAT_DIALOG_DATA);
}
