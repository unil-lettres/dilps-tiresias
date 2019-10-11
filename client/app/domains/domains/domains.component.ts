import { Component, Injector } from '@angular/core';
import { AbstractList } from '../../shared/components/AbstractList';
import { Domains, DomainsVariables } from '../../shared/generated-types';
import { DomainComponent } from '../domain/domain.component';
import { DomainService } from '../services/domain.service';

@Component({
    selector: 'app-domains',
    templateUrl: './domains.component.html',
    styleUrls: ['./domains.component.scss'],

})
export class DomainsComponent extends AbstractList<Domains['domains'], DomainsVariables> {

    constructor(service: DomainService, injector: Injector) {
        super(service, DomainComponent, injector);
    }

}
