import {Component} from '@angular/core';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';
import {MaterialComponent} from '../material/material.component';
import {MaterialService} from '../services/material.service';

@Component({
    selector: 'app-materials',
    templateUrl: './materials.component.html',
    styleUrls: ['./materials.component.scss'],
})
export class MaterialsComponent extends AbstractNavigableList<MaterialService> {
    public constructor(service: MaterialService) {
        super(service, MaterialComponent);
    }
}
