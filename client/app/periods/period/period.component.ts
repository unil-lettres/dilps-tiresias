import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {periodHierarchicConfig} from '../../shared/hierarchic-configurations/PeriodConfiguration';
import {UserService} from '../../users/services/user.service';
import {PeriodService} from '../services/period.service';
import {formatYearRange} from '../../shared/services/utility';
import {HierarchicFiltersConfiguration, Literal, NaturalSelectHierarchicComponent} from '@ecodev/natural';
import {PeriodFilter, Periods} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-period',
    templateUrl: './period.component.html',
    standalone: true,
    imports: [
        MatDialogModule,
        MatTabsModule,

        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        DialogFooterComponent,
        NaturalSelectHierarchicComponent,
    ],
})
export class PeriodComponent extends AbstractDetailDirective<PeriodService, ThesaurusDetailDialogExtraData> {
    public hierarchicConfig = periodHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<PeriodFilter> = [];

    public displayWith(item: Literal | null): string {
        return item ? item.name + formatYearRange(item.from, item.to) : '';
    }

    public constructor(
        service: PeriodService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<PeriodComponent>,
        @Inject(MAT_DIALOG_DATA)
        data: undefined | {item: Periods['periods']['items'][0] & ThesaurusDetailDialogExtraData},
    ) {
        super(service, alertService, dialogRef, userService, data);
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
