import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {materialHierarchicConfig} from '../../shared/hierarchic-configurations/MaterialConfiguration';
import {UserService} from '../../users/services/user.service';
import {MaterialService} from '../services/material.service';
import {HierarchicFiltersConfiguration} from '@ecodev/natural';
import {Material_material, MaterialFilter} from '../../shared/generated-types';

@Component({
    selector: 'app-material',
    templateUrl: './material.component.html',
})
export class MaterialComponent extends AbstractDetailDirective<MaterialService> {
    public hierarchicConfig = materialHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<MaterialFilter> = [];

    public constructor(
        service: MaterialService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<MaterialComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Material_material},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }

    protected override postQuery(): void {
        // Prevent parent choices that would form cyclic hierarchy
        if (this.data.item.id) {
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
