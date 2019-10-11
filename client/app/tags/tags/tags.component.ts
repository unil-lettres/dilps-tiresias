import { Component, Injector } from '@angular/core';
import { AbstractNavigableList } from '../../shared/components/AbstractNavigableList';
import { Tags, TagsVariables } from '../../shared/generated-types';
import { TagComponent } from '../tag/tag.component';
import { TagService } from '../services/tag.service';

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
