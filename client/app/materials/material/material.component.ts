import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {materialHierarchicConfig} from '../../shared/hierarchic-configurations/MaterialConfiguration';
import {MaterialService} from '../services/material.service';
import {HierarchicFiltersConfiguration, NaturalSelectHierarchicComponent} from '@ecodev/natural';
import {MaterialFilter} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Component({
    selector: 'app-material',
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
    templateUrl: './material.component.html',
})
export class MaterialComponent extends AbstractDetailDirective<MaterialService, ThesaurusDetailDialogExtraData> {
    public hierarchicConfig = materialHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<MaterialFilter> = [];

    public constructor() {
        super(inject(MaterialService));
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
