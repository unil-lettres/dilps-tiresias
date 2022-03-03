import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
    public constructor(@Inject(MAT_DIALOG_DATA) public readonly data: any) {}
}
