import {Component, Injector} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {ChangeService} from '../services/change.service';

@Component({
    selector: 'app-changes',
    templateUrl: './changes.component.html',
    styleUrls: ['./changes.component.scss'],
})
export class ChangesComponent extends AbstractList<ChangeService> {
    public displayedColumns = ['type', 'original', 'suggestion', 'owner', 'creationDate'];

    constructor(service: ChangeService, injector: Injector) {
        super(service, null, injector);
    }
}
