import {Component} from '@angular/core';
import {DomainComponent} from '../domain/domain.component';
import {DomainService} from '../services/domain.service';
import {AbstractNavigableList} from '../../shared/components/AbstractNavigableList';

@Component({
    selector: 'app-domains',
    templateUrl: './domains.component.html',
    styleUrls: ['./domains.component.scss'],
})
export class DomainsComponent extends AbstractNavigableList<DomainService> {
    public constructor(service: DomainService) {
        super(service, DomainComponent);
    }
}
