import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-number-selector',
    imports: [MatDialogModule, MatFormField, MatLabel, MatInput, FormsModule, MatButton],
    templateUrl: './number-selector.component.html',
    styleUrl: './number-selector.component.scss',
})
export class NumberSelectorComponent {
    protected number = 5;
}
