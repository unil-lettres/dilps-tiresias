import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {periodHierarchicConfig} from '../../shared/hierarchic-configurations/PeriodConfiguration';
import {PeriodService} from '../services/period.service';
import {formatYearRange} from '../../shared/services/utility';
import {HierarchicFiltersConfiguration, Literal, NaturalSelectHierarchicComponent} from '@ecodev/natural';
import {PeriodFilter} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Component({
    selector: 'app-period',
    imports: [
        MatDialogModule,
        MatTab,
        MatTabGroup,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        DialogFooterComponent,
        NaturalSelectHierarchicComponent,
    ],
    templateUrl: './period.component.html',
})
export class PeriodComponent extends AbstractDetailDirective<PeriodService, ThesaurusDetailDialogExtraData> {
    public hierarchicConfig = periodHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<PeriodFilter> = [];

    public displayWith(item: Literal | null): string {
        return item ? item.name + formatYearRange(item.from, item.to) : '';
    }

    public constructor() {
        super(inject(PeriodService));
    }

    protected override postQuery(): void {
        // Prevent parent choices that would form cyclic hierarchy
        if (this.isUpdatePage()) {
            this.ancestorsHierarchicFilters = [
                {
                    service: PeriodService,
                    filter: {
                        groups: [{conditions: [{custom: {excludeSelfAndDescendants: {value: this.data.item.id}}}]}],
                    },
                },
            ];
        }
    }
}
