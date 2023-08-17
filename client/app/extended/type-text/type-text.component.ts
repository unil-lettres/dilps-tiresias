/**
 * This class was extended from its module to update the template
 * by removing the "Valeur" label in search field.
 */

import {Component} from '@angular/core';
import {TypeTextComponent as EcoDevTypeTextComponent} from '@ecodev/natural';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
    templateUrl: './type-text.component.html',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class TypeTextComponent extends EcoDevTypeTextComponent {}
