import {Directive} from '@angular/core';
import {AbstractControl, Validator, NG_VALIDATORS} from '@angular/forms';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'input[type="url"]',
    providers: [{provide: NG_VALIDATORS, useExisting: UrlValidatorDirective, multi: true}],
    standalone: true,
})
export class UrlValidatorDirective implements Validator {
    public validate(control: AbstractControl): {[key: string]: any} | null {
        // Ask the browser to validate for us
        const c: HTMLInputElement = document.createElement('input');
        c.type = 'url';
        c.value = control.value;

        const isValid = c.checkValidity();

        return isValid ? null : {url: {value: control.value}};
    }
}
