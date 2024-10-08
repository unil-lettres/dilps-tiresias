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
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
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
export class TagComponent extends AbstractDetailDirective<TagService, ThesaurusDetailDialogExtraData> {
    public hierarchicConfig = tagHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<TagFilter> = [];

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
