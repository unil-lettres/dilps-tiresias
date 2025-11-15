import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {tagHierarchicConfig} from '../../shared/hierarchic-configurations/TagConfiguration';
import {TagService} from '../services/tag.service';
import {TagFilter} from '../../shared/generated-types';
import {HierarchicFiltersConfiguration, NaturalSelectHierarchicComponent} from '@ecodev/natural';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Component({
    selector: 'app-tag',
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
    templateUrl: './tag.component.html',
})
export class TagComponent extends AbstractDetailDirective<TagService, ThesaurusDetailDialogExtraData> {
    protected hierarchicConfig = tagHierarchicConfig;
    protected ancestorsHierarchicFilters: HierarchicFiltersConfiguration<TagFilter> = [];

    public constructor() {
        super(inject(TagService));
    }

    protected override postQuery(): void {
        // Prevent parent choices that would form cyclic hierarchy
        if (this.isUpdatePage()) {
            this.ancestorsHierarchicFilters = [
                {
                    service: TagService,
                    filter: {
                        groups: [{conditions: [{custom: {excludeSelfAndDescendants: {value: this.data.item.id}}}]}],
                    },
                },
            ];
        }
    }
}
