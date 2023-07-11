/**
 * This class was extended from its module to hide the operators list
 * and always use "is".
 */

import {Component} from '@angular/core';
import {
    TypeNaturalSelectComponent as EcoDevTypeNaturalSelectComponent,
    FilterGroupConditionField,
    NaturalAbstractModelService,
    NaturalSelectComponent,
} from '@ecodev/natural';
import {NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    templateUrl: './type-natural-select.component.html',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, NaturalSelectComponent],
})
export class TypeNaturalSelectComponent<
    TService extends NaturalAbstractModelService<any, any, any, any, any, any, any, any, any, any>,
> extends EcoDevTypeNaturalSelectComponent<TService> {
    public override getCondition(): FilterGroupConditionField {
        if (!this.isValid()) {
            return {};
        }

        const id = this.valueCtrl.value?.id;
        const values = id ? [id] : [];

        return this.operatorKeyToCondition('is', values);
    }

    protected override getRenderedValue(): string {
        if (!this.isValid()) {
            return '';
        }

        return this.renderValueWithoutOperator();
    }
}
