import {Directive, forwardRef} from '@angular/core';
import {type AbstractControl, NG_VALIDATORS, type ValidationErrors, type Validator} from '@angular/forms';
import {deliverableEmail} from '@ecodev/natural';

/**
 * Accept only the emails that the server accepts
 */
@Directive({
    selector: '[appEmail]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => EmailValidatorDirective),
            multi: true,
        },
    ],
})
export class EmailValidatorDirective implements Validator {
    public validate(control: AbstractControl): ValidationErrors | null {
        return deliverableEmail(control);
    }
}
