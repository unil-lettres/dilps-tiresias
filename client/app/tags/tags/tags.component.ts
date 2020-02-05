import { Component, Injector } from '@angular/core';
import { Sorting, SortingOrder } from '@ecodev/natural';
import { AbstractNavigableList } from '../../shared/components/AbstractNavigableList';
import { PeriodSortingField, Tags, TagSortingField, TagsVariables } from '../../shared/generated-types';
import { TagService } from '../services/tag.service';
import { TagComponent } from '../tag/tag.component';

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],

})
export class TagsComponent extends AbstractNavigableList<Tags['tags'], TagsVariables> {

    protected defaultSorting: Array<Sorting> = [{field: TagSortingField.name, order: SortingOrder.ASC}];


    constructor(service: TagService, injector: Injector) {
        super(service, TagComponent, injector);
    }

}
