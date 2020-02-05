import { Component, Injector } from '@angular/core';
import { Sorting, SortingOrder } from '@ecodev/natural';
import { AbstractNavigableList } from '../../shared/components/AbstractNavigableList';
import { Materials, MaterialSortingField, MaterialsVariables } from '../../shared/generated-types';
import { MaterialComponent } from '../material/material.component';
import { MaterialService } from '../services/material.service';

@Component({
    selector: 'app-materials',
    templateUrl: './materials.component.html',
    styleUrls: ['./materials.component.scss'],

})
export class MaterialsComponent extends AbstractNavigableList<Materials['materials'], MaterialsVariables> {

    protected defaultSorting: Array<Sorting> = [{field: MaterialSortingField.name, order: SortingOrder.ASC}];

    constructor(service: MaterialService, injector: Injector) {
        super(service, MaterialComponent, injector);
    }

}
