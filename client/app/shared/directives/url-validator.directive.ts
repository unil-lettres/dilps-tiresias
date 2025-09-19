import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
    selector: '[appUrl]',
    providers: [{provide: NG_VALIDATORS, useExisting: UrlValidatorDirective, multi: true}],
})
export class UrlValidatorDirective implements Validator {
    public validate(control: AbstractControl): Record<string, any> | null {
        // Ask the browser to validate for us
        const c: HTMLInputElement = document.createElement('input');
        c.type = 'url';
        c.value = control.value;

        const isValid = c.checkValidity();

        return isValid ? null : {url: {value: control.value}};
    }
}
