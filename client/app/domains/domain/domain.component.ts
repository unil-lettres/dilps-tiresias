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
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Component({
    selector: 'app-domain',
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
    templateUrl: './domain.component.html',
})
export class DomainComponent extends AbstractDetailDirective<DomainService, ThesaurusDetailDialogExtraData> {
    protected hierarchicConfig = domainHierarchicConfig;
    protected ancestorsHierarchicFilters: HierarchicFiltersConfiguration<DomainFilter> = [];

    public constructor() {
        super(inject(DomainService));
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

    protected override getTitleDeleteMessage(): string {
        return `Supprimer le domaine « ${this.data.item.name} » ?`;
    }

    protected override getDeleteMessage(): string {
        return `<strong>Tous ses enfants</strong> seront également supprimés.<br><br><strong>Cette action est irréversible.</strong>`;
    }
}
