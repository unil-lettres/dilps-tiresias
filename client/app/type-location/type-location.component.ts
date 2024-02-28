import {Component, Inject} from '@angular/core';
import {FormControl, Validators, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {
    DropdownComponent,
    NATURAL_DROPDOWN_DATA,
    NaturalDropdownData,
    NaturalDropdownRef,
    FilterGroupConditionField,
} from '@ecodev/natural';
import {LocationOperatorString} from '../shared/generated-types';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    templateUrl: './type-location.component.html',
    styleUrls: ['./type-location.component.scss'],
    standalone: true,
    imports: [FormsModule, FlexModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class TypeLocationComponent implements DropdownComponent {
    public renderedValue = new BehaviorSubject<string>('');
    public form: FormGroup;

    public longitudeCtrl = new FormControl();
    public latitudeCtrl = new FormControl();
    public distanceCtrl = new FormControl();

    public constructor(
        @Inject(NATURAL_DROPDOWN_DATA) data: NaturalDropdownData<never>,
        protected readonly dropdownRef: NaturalDropdownRef,
    ) {
        this.form = new FormGroup({
            longitude: this.longitudeCtrl,
            latitude: this.latitudeCtrl,
            distance: this.distanceCtrl,
        });

        this.form.valueChanges.subscribe(() => {
            this.renderedValue.next(this.getRenderedValue());
        });

        this.initValidators();
        this.reloadCondition(data.condition);
    }

    public getCondition(): FilterGroupConditionField {
        return {
            distance: {
                longitude: this.longitudeCtrl.value,
                latitude: this.latitudeCtrl.value,
                distance: this.distanceCtrl.value,
            },
        };
    }

    public isValid(): boolean {
        return this.form.valid;
    }

    public isDirty(): boolean {
        return this.form.dirty;
    }

    public close(): void {
        if (this.isValid()) {
            this.dropdownRef.close({condition: this.getCondition()});
        } else {
            this.dropdownRef.close(); // undefined value, discard changes / prevent to add a condition (on new fields
        }
    }

    private reloadCondition(condition: FilterGroupConditionField | null): void {
        const value: LocationOperatorString = {
            longitude: null!,
            latitude: null!,
            distance: null!,
        };

        if (condition && condition.distance) {
            value.longitude = condition.distance.longitude;
            value.latitude = condition.distance.latitude;
            value.distance = condition.distance.distance;
        }

        // Default to 200 meters
        if (!value.distance) {
            value.distance = 200;
        }

        this.form.setValue(value);
    }

    private initValidators(): void {
        this.longitudeCtrl.setValidators([Validators.required, Validators.min(-180), Validators.max(180)]);

        this.latitudeCtrl.setValidators([Validators.required, Validators.min(-90), Validators.max(90)]);

        this.distanceCtrl.setValidators([Validators.required, Validators.min(1)]);
    }

    private getRenderedValue(): string {
        if (this.longitudeCtrl.value && this.latitudeCtrl.value && this.distanceCtrl.value) {
            let distance = this.distanceCtrl.value;
            let unit = 'm';
            if (distance / 1000 > 1) {
                distance = distance / 1000;
                unit = 'km';
            }
            return `à ${distance} ${unit} de ${this.longitudeCtrl.value}, ${this.latitudeCtrl.value}`;
        } else {
            return '';
        }
    }
}
