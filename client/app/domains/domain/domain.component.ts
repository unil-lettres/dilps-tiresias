import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {domainHierarchicConfig} from '../../shared/hierarchic-configurations/DomainConfiguration';
import {UserService} from '../../users/services/user.service';
import {DomainService} from '../services/domain.service';

@Component({
    selector: 'app-domain',
    templateUrl: './domain.component.html',
})
export class DomainComponent extends AbstractDetailDirective<DomainService> {
    public hierarchicConfig = domainHierarchicConfig;

    public constructor(
        service: DomainService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<DomainComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
    ) {
        super(service, alertService, dialogRef, userService, data);
    }
}
