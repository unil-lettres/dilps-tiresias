import {Component, Injector} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {InstitutionComponent} from '../institution/institution.component';
import {InstitutionService} from '../services/institution.service';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html',
    styleUrls: ['./institutions.component.scss'],
})
export class InstitutionsComponent extends AbstractList<InstitutionService> {
    public displayedColumns = ['name', 'locality'];

    public constructor(service: InstitutionService, injector: Injector) {
        super(service, InstitutionComponent, injector);
    }
}
