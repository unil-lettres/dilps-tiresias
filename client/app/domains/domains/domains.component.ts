import { Component, Injector } from '@angular/core';
import { Sorting, SortingOrder } from '@ecodev/natural';
import { AbstractNavigableList } from '../../shared/components/AbstractNavigableList';
import { Domains, DomainSortingField, DomainsVariables } from '../../shared/generated-types';
import { DomainComponent } from '../domain/domain.component';
import { DomainService } from '../services/domain.service';

@Component({
    selector: 'app-domains',
    templateUrl: './domains.component.html',
    styleUrls: ['./domains.component.scss'],

})
export class DomainsComponent extends AbstractNavigableList<Domains['domains'], DomainsVariables> {

    protected defaultSorting: Array<Sorting> = [{field: DomainSortingField.name, order: SortingOrder.ASC}];

    constructor(service: DomainService, injector: Injector) {
        super(service, DomainComponent, injector);
    }

}
