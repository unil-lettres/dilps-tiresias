import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {domainHierarchicConfig} from '../../shared/hierarchic-configurations/DomainConfiguration';
import {UserService} from '../../users/services/user.service';
import {DomainService} from '../services/domain.service';
import {HierarchicFiltersConfiguration, NaturalSelectHierarchicComponent} from '@ecodev/natural';
import {DomainFilter, Domains} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-domain',
    templateUrl: './domain.component.html',
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
export class DomainComponent extends AbstractDetailDirective<DomainService, ThesaurusDetailDialogExtraData> {
    public hierarchicConfig = domainHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<DomainFilter> = [];

    public constructor(
        service: DomainService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<DomainComponent>,
        @Inject(MAT_DIALOG_DATA)
        data:
            | undefined
            | {
                  item: Domains['domains']['items'][0] & ThesaurusDetailDialogExtraData;
              },
    ) {
        super(service, alertService, dialogRef, userService, data);
    }

    protected override postQuery(): void {
        // Prevent parent choices that would form cyclic hierarchy
        if (this.isUpdatePage()) {
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
