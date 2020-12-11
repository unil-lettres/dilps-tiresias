import {Component, Injector} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {Changes, ChangesVariables} from '../../shared/generated-types';
import {ChangeService} from '../services/change.service';

@Component({
    selector: 'app-changes',
    templateUrl: './changes.component.html',
    styleUrls: ['./changes.component.scss'],
})
export class ChangesComponent extends AbstractList<Changes['changes'], ChangesVariables> {
    public displayedColumns = ['type', 'original', 'suggestion', 'owner', 'creationDate'];

    constructor(service: ChangeService, injector: Injector) {
        super(service, null, injector);
    }
}
