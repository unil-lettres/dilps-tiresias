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
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-material',
    templateUrl: './material.component.html',
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
