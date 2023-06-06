/**
 * This class was extended from its module to update the template
 * by removing the "Valeur" label in search field.
 */

import {Component} from '@angular/core';
import {TypeTextComponent as EcoDevTypeTextComponent} from '@ecodev/natural';

@Component({
    templateUrl: './type-text.component.html',
})
export class TypeTextComponent extends EcoDevTypeTextComponent {}
