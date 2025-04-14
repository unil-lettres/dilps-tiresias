/**
 * This class was extended from its module to update the template
 * by removing the "Valeur" label in search field.
 */

import {Component} from '@angular/core';
import {TypeTextComponent as EcoDevTypeTextComponent} from '@ecodev/natural';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
    templateUrl: './type-text.component.html',
    imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
})
export class TypeTextComponent extends EcoDevTypeTextComponent {}
