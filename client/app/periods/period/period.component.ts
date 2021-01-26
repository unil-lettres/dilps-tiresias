import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {periodHierarchicConfig} from '../../shared/hierarchic-configurations/PeriodConfiguration';
import {UserService} from '../../users/services/user.service';
import {PeriodService} from '../services/period.service';
import {formatYearRange} from '../../shared/services/utility';
import {Literal} from '@ecodev/natural/lib/types/types';

@Component({
    selector: 'app-period',
    templateUrl: './period.component.html',
})
export class PeriodComponent extends AbstractDetailDirective<PeriodService> {
    public hierarchicConfig = periodHierarchicConfig;

    public displayWith(item: Literal): string {
        return item ? item.name + formatYearRange(item.from, item.to) : '';
    }

    constructor(
        service: PeriodService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<PeriodComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
    ) {
        super(service, alertService, dialogRef, userService, data);
    }
}
