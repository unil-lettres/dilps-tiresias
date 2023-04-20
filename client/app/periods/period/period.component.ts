import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {periodHierarchicConfig} from '../../shared/hierarchic-configurations/PeriodConfiguration';
import {UserService} from '../../users/services/user.service';
import {PeriodService} from '../services/period.service';
import {formatYearRange} from '../../shared/services/utility';
import {HierarchicFiltersConfiguration, Literal} from '@ecodev/natural';
import {Period_period, PeriodFilter} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';

@Component({
    selector: 'app-period',
    templateUrl: './period.component.html',
})
export class PeriodComponent extends AbstractDetailDirective<PeriodService, ThesaurusDetailDialogExtraData> {
    public hierarchicConfig = periodHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<PeriodFilter> = [];

    public displayWith(item: Literal): string {
        return item ? item.name + formatYearRange(item.from, item.to) : '';
    }

    public constructor(
        service: PeriodService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<PeriodComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Period_period & ThesaurusDetailDialogExtraData},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }

    protected override postQuery(): void {
        // Prevent parent choices that would form cyclic hierarchy
        if (this.data.item.id) {
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
