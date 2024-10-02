import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {domainHierarchicConfig} from '../../shared/hierarchic-configurations/DomainConfiguration';
import {DomainService} from '../services/domain.service';
import {HierarchicFiltersConfiguration, NaturalSelectHierarchicComponent} from '@ecodev/natural';
import {DomainFilter} from '../../shared/generated-types';
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

    public constructor() {
        const service = inject(DomainService);

        super(service);
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
