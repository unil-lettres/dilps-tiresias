import {Directive, forwardRef, input} from '@angular/core';
import {type AbstractControl, type AsyncValidator, NG_ASYNC_VALIDATORS, type ValidationErrors} from '@angular/forms';
import {type NaturalAbstractModelService, unique} from '@ecodev/natural';
import {type Observable, of} from 'rxjs';

@Directive({
    selector: '[appUnique]',
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => UniqueValidatorDirective),
            multi: true,
        },
    ],
})
export class UniqueValidatorDirective implements AsyncValidator {
    public readonly model = input.required<any>({alias: 'appUnique'});
    public readonly fieldName = input.required<string>();
    public readonly service =
        input.required<NaturalAbstractModelService<any, any, any, any, any, any, any, any, any, any>>();

    public validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        const model = this.model();
        const field = this.fieldName();

        if (model?.[field] === undefined) {
            return of(null);
        }

        const validator = unique(field, model.id, this.service());

        return validator(control);
    }
}
