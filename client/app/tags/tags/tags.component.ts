import { Component, Injector } from '@angular/core';
import { AbstractNavigableList } from '../../shared/components/AbstractNavigableList';
import { Tags, TagsVariables } from '../../shared/generated-types';
import { TagService } from '../services/tag.service';
import { TagComponent } from '../tag/tag.component';

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],

})
export class TagsComponent extends AbstractNavigableList<Tags['tags'], TagsVariables> {

    constructor(service: TagService, injector: Injector) {
        super(service, TagComponent, injector);
    }

}
