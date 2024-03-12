import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-number-selector',
    templateUrl: './number-selector.component.html',
    styleUrl: './number-selector.component.scss',
    standalone: true,
    imports: [MatDialogModule, FlexModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class NumberSelectorComponent {
    public number = 5;
}
