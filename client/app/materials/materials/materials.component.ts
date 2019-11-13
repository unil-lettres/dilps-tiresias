import { Component, Injector } from '@angular/core';
import { AbstractNavigableList } from '../../shared/components/AbstractNavigableList';
import { Materials, MaterialsVariables } from '../../shared/generated-types';
import { MaterialComponent } from '../material/material.component';
import { MaterialService } from '../services/material.service';

@Component({
    selector: 'app-materials',
    templateUrl: './materials.component.html',
    styleUrls: ['./materials.component.scss'],

})
export class MaterialsComponent extends AbstractNavigableList<Materials['materials'], MaterialsVariables> {

    constructor(service: MaterialService, injector: Injector) {
        super(service, MaterialComponent, injector);
    }

}