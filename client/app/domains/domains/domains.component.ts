import {Component, Injector} from '@angular/core';
import {Domains, DomainsVariables} from '../../shared/generated-types';
import {DomainComponent} from '../domain/domain.component';
import {DomainService} from '../services/domain.service';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';

@Component({
    selector: 'app-domains',
    templateUrl: './domains.component.html',
    styleUrls: ['./domains.component.scss'],
})
export class DomainsComponent extends AbstractNavigableList<Domains['domains'], DomainsVariables> {
    constructor(service: DomainService, injector: Injector) {
        super(service, DomainComponent, injector);
    }
}
