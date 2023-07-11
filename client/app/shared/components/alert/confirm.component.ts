import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmComponent {
    public constructor(@Inject(MAT_DIALOG_DATA) public readonly data: any) {}
}
