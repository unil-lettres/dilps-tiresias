/**
 * This class was extended from its module to update the template
 * by removing the "Valeur" label in search field.
 */

import {TypeTextComponent as EcoDevTypeTextComponent} from '@ecodev/natural';
import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField} from '@angular/material/form-field';

@Component({
    imports: [MatFormField, MatError, MatInput, FormsModule, ReactiveFormsModule],
    templateUrl: './type-text.component.html',
})
export class TypeTextComponent extends EcoDevTypeTextComponent {}
