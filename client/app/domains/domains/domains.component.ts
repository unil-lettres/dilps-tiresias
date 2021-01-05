import {Component, Injector} from '@angular/core';
import {DomainComponent} from '../domain/domain.component';
import {DomainService} from '../services/domain.service';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';

@Component({
    selector: 'app-domains',
    templateUrl: './domains.component.html',
    styleUrls: ['./domains.component.scss'],
})
export class DomainsComponent extends AbstractNavigableList<DomainService> {
    constructor(service: DomainService, injector: Injector) {
        super(service, DomainComponent, injector);
    }
}
