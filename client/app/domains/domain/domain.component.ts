import {Component, Inject} from '@angular/core';
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {domainHierarchicConfig} from '../../shared/hierarchic-configurations/DomainConfiguration';
import {UserService} from '../../users/services/user.service';
import {DomainService} from '../services/domain.service';
import {HierarchicFiltersConfiguration} from '@ecodev/natural';
import {Domain_domain, DomainFilter} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';

@Component({
    selector: 'app-domain',
    templateUrl: './domain.component.html',
})
export class DomainComponent extends AbstractDetailDirective<DomainService, ThesaurusDetailDialogExtraData> {
    public hierarchicConfig = domainHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<DomainFilter> = [];

    public constructor(
        service: DomainService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<DomainComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Domain_domain & ThesaurusDetailDialogExtraData},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }

    protected override postQuery(): void {
        // Prevent parent choices that would form cyclic hierarchy
        if (this.data.item.id) {
            this.ancestorsHierarchicFilters = [
                {
                    service: DomainService,
                    filter: {
                        groups: [{conditions: [{custom: {excludeSelfAndDescendants: {value: this.data.item.id}}}]}],
                    },
                },
            ];
        }
    }
}
