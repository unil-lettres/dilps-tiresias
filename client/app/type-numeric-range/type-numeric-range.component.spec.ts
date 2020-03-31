import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    FilterGroupConditionField,
    NATURAL_DROPDOWN_DATA,
    NaturalDropdownData, NaturalDropdownRef,
} from '@ecodev/natural';
import {
    TypeNumericRangeComponent,
    TypeNumericRangeConfiguration,
} from './type-numeric-range.component';

describe('TypeNumericRangeComponent', () => {
    let component: TypeNumericRangeComponent;
    let fixture: ComponentFixture<TypeNumericRangeComponent>;
    let dialogCloseSpy: jasmine.Spy;
    const data: NaturalDropdownData = {
        condition: null,
        configuration: null,
    };

    const condition: FilterGroupConditionField = {
        between: {from: 12, to: 18},
    };

    const config: TypeNumericRangeConfiguration = {};

    const configWithRules: TypeNumericRangeConfiguration = {
        min: 1,
        max: 10,
    };

    beforeEach(async(() => {
        const dialogRef = {close: () => true};
        dialogCloseSpy = spyOn(dialogRef, 'close');

        TestBed.configureTestingModule({
            declarations: [TypeNumericRangeComponent],
            imports: [
                NoopAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
            ],
            providers: [
                {
                    provide: NATURAL_DROPDOWN_DATA,
                    useValue: data,
                },
                {
                    provide: NaturalDropdownRef,
                    useValue: dialogRef,
                },
            ],
        }).compileComponents();
    }));

    function createComponent(c: FilterGroupConditionField | null, configuration: TypeNumericRangeConfiguration | null) {
        data.condition = c;
        data.configuration = configuration;
        TestBed.overrideProvider(NATURAL_DROPDOWN_DATA, {useValue: data});
        fixture = TestBed.createComponent<TypeNumericRangeComponent>(TypeNumericRangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should create', () => {
        createComponent(null, null);
        expect(component).toBeTruthy();
    });

    it('should get condition', () => {
        const empty: any = {};

        createComponent(null, null);
        expect(component.getCondition()).toEqual(empty);

        createComponent(condition, config);
        expect(component.getCondition()).toEqual(condition);

        createComponent(condition, configWithRules);
        expect(component.getCondition()).toEqual(condition);
    });

    it('should rendered value as string', () => {
        createComponent(null, null);
        expect(component.renderedValue.value).toBe('');

        createComponent(condition, config);
        expect(component.renderedValue.value).toBe('12 - 18');

        createComponent(condition, configWithRules);
        expect(component.renderedValue.value).toBe('12 - 18');
    });

    it('should validate according to rules', () => {
        createComponent(null, null);
        expect(component.isValid()).toBe(false);

        createComponent(condition, config);
        expect(component.isValid()).toBe(true);

        createComponent(condition, configWithRules);
        expect(component.isValid()).toBe(false);
    });

    it('should close', () => {
        createComponent(null, null);
        component.close();
        expect(dialogCloseSpy).toHaveBeenCalled();
    });
});
