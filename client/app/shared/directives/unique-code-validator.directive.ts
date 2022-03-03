import {Directive, Input} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {CardService} from '../../card/services/card.service';
import {unique} from '@ecodev/natural';
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

    public constructor(private readonly cardService: CardService) {}

    public validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        const validator = unique('code', this.model.id, this.cardService);

        return validator(control);
    }
}
