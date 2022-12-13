import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {tagHierarchicConfig} from '../../shared/hierarchic-configurations/TagConfiguration';
import {UserService} from '../../users/services/user.service';
import {TagService} from '../services/tag.service';
import {Tag_tag, TagFilter} from '../../shared/generated-types';
import {HierarchicFiltersConfiguration} from '@ecodev/natural';

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
})
export class TagComponent extends AbstractDetailDirective<TagService> {
    public hierarchicConfig = tagHierarchicConfig;
    public ancestorsHierarchicFilters: HierarchicFiltersConfiguration<TagFilter> = [];

    public constructor(
        service: TagService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<TagComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Tag_tag},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }

    protected override postQuery(): void {
        // Prevent parent choices that would form cyclic hierarchy
        if (this.data.item.id) {
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
