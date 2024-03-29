import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {materialHierarchicConfig} from '../../shared/hierarchic-configurations/MaterialConfiguration';
import {UserService} from '../../users/services/user.service';
import {MaterialService} from '../services/material.service';
import {HierarchicFiltersConfiguration, NaturalSelectHierarchicComponent} from '@ecodev/natural';
import {MaterialFilter, Materials} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-material',
    templateUrl: './material.component.html',
    standalone: true,
    imports: [
        MatDialogModule,
        MatTabsModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        DialogFooterComponent,
        NaturalSelectHierarchicComponent,
    ],
})
export class MaterialComponent extends AbstractDetailDirective<MaterialService, ThesaurusDetailDialogExtraData> {
    public hierarchicConfig = materialHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<MaterialFilter> = [];

    public constructor(
        service: MaterialService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<MaterialComponent>,
        @Inject(MAT_DIALOG_DATA)
        data:
            | undefined
            | {
                  item: Materials['materials']['items'][0] & ThesaurusDetailDialogExtraData;
              },
    ) {
        super(service, alertService, dialogRef, userService, data);
    }

    protected override postQuery(): void {
        // Prevent parent choices that would form cyclic hierarchy
        if (this.isUpdatePage()) {
            this.ancestorsHierarchicFilters = [
                {
                    service: MaterialService,
                    filter: {
                        groups: [{conditions: [{custom: {excludeSelfAndDescendants: {value: this.data.item.id}}}]}],
                    },
                },
            ];
        }
    }
}
