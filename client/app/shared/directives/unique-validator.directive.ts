import {Directive, input} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {NaturalAbstractModelService, unique} from '@ecodev/natural';
import {Observable, of} from 'rxjs';

@Directive({
    selector: '[appUnique]',
    standalone: true,
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: UniqueValidatorDirective,
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

        if (!model || model[field] === undefined) {
            return of(null);
        }

        const validator = unique(field, model.id, this.service());

        return validator(control);
    }
}
