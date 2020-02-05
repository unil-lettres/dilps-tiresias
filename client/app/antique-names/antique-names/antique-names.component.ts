import { Component, Injector } from '@angular/core';
import { Sorting, SortingOrder } from '@ecodev/natural';
import { AbstractList } from '../../shared/components/AbstractList';
import { AntiqueNames, AntiqueNameSortingField, AntiqueNamesVariables } from '../../shared/generated-types';
import { AntiqueNameComponent } from '../antique-name/antique-name.component';
import { AntiqueNameService } from '../services/antique-name.service';

@Component({
    selector: 'app-antique-names',
    templateUrl: './antique-names.component.html',
    styleUrls: ['./antique-names.component.scss'],

})
export class AntiqueNamesComponent extends AbstractList<AntiqueNames['antiqueNames'], AntiqueNamesVariables> {

    protected defaultSorting: Array<Sorting> = [{field: AntiqueNameSortingField.name, order: SortingOrder.ASC}];

    constructor(service: AntiqueNameService, injector: Injector) {
        super(service, AntiqueNameComponent, injector);
    }

}
