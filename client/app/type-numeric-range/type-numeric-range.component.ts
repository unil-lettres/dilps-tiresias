import {Component, Inject} from '@angular/core';
import {
    AbstractControl,
    FormGroupDirective,
    NgForm,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {BehaviorSubject} from 'rxjs';
import {
    DropdownComponent,
    FilterGroupConditionField,
    NATURAL_DROPDOWN_DATA,
    NaturalDropdownData,
    NaturalDropdownRef,
} from '@ecodev/natural';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export interface TypeNumericRangeConfiguration {
    min?: number | null;
    max?: number | null;
    step?: number | null;
}

class InvalidWithValueStateMatcher implements ErrorStateMatcher {
    public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return (form && form.invalid && (form.value.to || form.value.from)) || (control && control.invalid);
    }
}

function parseFromControl(control: AbstractControl, key: string): number {
    const c = control.get(key);
    if (!c) {
        return NaN;
    }

    return parseFloat(c.value);
}

/**
 * From >= To
 */
function toGreaterThanFrom(control: AbstractControl): ValidationErrors | null {
    const from = parseFromControl(control, 'from');
    const to = parseFromControl(control, 'to');

    if (!isNaN(from) && !isNaN(to) && from > to) {
        return {toGreaterThanFrom: true};
    }

    return null;
}

@Component({
    templateUrl: './type-numeric-range.component.html',
    styleUrls: ['./type-numeric-range.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule],
})
export class TypeNumericRangeComponent implements DropdownComponent {
    public renderedValue = new BehaviorSubject<string>('');
    public configuration: TypeNumericRangeConfiguration;
    public matcher = new InvalidWithValueStateMatcher();
    public fromCtrl = new FormControl();
    public toCtrl = new FormControl();
    public form: FormGroup;

    private readonly defaults: TypeNumericRangeConfiguration = {
        min: null,
        max: null,
        step: null,
    };

    public constructor(
        @Inject(NATURAL_DROPDOWN_DATA) data: NaturalDropdownData<TypeNumericRangeConfiguration>,
        protected readonly dropdownRef: NaturalDropdownRef,
    ) {
        this.configuration = {...this.defaults, ...data.configuration};

        this.form = new FormGroup({
            from: this.fromCtrl,
            to: this.toCtrl,
        });

        this.form.valueChanges.subscribe(() => {
            this.renderedValue.next(this.getRenderedValue());
        });

        this.initValidators();
        this.reloadCondition(data.condition);
    }

    public getCondition(): FilterGroupConditionField {
        const from = this.fromCtrl.value;
        const to = this.toCtrl.value;

        if (from && to) {
            return {between: {from, to}};
        } else if (from) {
            return {greaterOrEqual: {value: from}};
        } else if (to) {
            return {lessOrEqual: {value: to}};
        } else {
            return {};
        }
    }

    public isValid(): boolean {
        return this.form.valid;
    }

    public isDirty(): boolean {
        return this.form.dirty;
    }

    private reloadCondition(condition: FilterGroupConditionField | null): void {
        if (!condition) {
            return;
        }

        const value = {
            from: null as number | null,
            to: null as number | null,
        };

        if (condition.between) {
            value.from = condition.between.from as number;
            value.to = condition.between.to as number;
        }

        this.form.setValue(value);
    }

    private initValidators(): void {
        const rangeValidators: ValidatorFn[] = [Validators.required];
        if (this.configuration.min) {
            rangeValidators.push(Validators.min(this.configuration.min));
        }

        if (this.configuration.max) {
            rangeValidators.push(Validators.max(this.configuration.max));
        }

        this.fromCtrl.setValidators(rangeValidators);
        this.toCtrl.setValidators(rangeValidators);

        this.form.setValidators([
            toGreaterThanFrom, // From < To
        ]);
    }

    private getRenderedValue(): string {
        const from = parseFloat(this.fromCtrl.value as string);
        const to = parseFloat(this.toCtrl.value as string);

        if (!isNaN(from) && !isNaN(to)) {
            return from + ' - ' + to;
        } else {
            return '';
        }
    }

    public close(): void {
        if (this.isValid()) {
            this.dropdownRef.close({condition: this.getCondition()});
        } else {
            this.dropdownRef.close(); // undefined value, discard changes / prevent to add a condition (on new fields
        }
    }
}
