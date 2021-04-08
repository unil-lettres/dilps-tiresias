/* tslint:disable:directive-selector */
import {Directive, Input} from '@angular/core';
import {
    AbstractControl,
    Validator,
    NG_VALIDATORS,
    AsyncValidator,
    ValidationErrors,
    NG_ASYNC_VALIDATORS,
} from '@angular/forms';
import {Observable} from 'rxjs';
import {CardService} from '../../card/services/card.service';
import {unique} from '@ecodev/natural';
import {Card_card, CardInput} from '../generated-types';
import {CardInputWithId} from '../../card/card.component';

@Directive({
    selector: '[appUniqueCode]',
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: UniqueCodeValidatorDirective,
            multi: true,
        },
    ],
})
export class UniqueCodeValidatorDirective implements AsyncValidator {
    @Input('appUniqueCode') public model: CardInputWithId;

    constructor(private readonly cardService: CardService) {}

    public validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        const validator = unique('code', this.model.id, this.cardService);

        return validator(control);
    }
}
