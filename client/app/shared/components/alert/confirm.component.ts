import {Component, Inject} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
    public constructor(@Inject(MAT_DIALOG_DATA) public readonly data: any) {}
}
