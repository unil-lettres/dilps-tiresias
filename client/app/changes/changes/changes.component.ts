import {Component, Injector} from '@angular/core';
import {ChangeService} from '../services/change.service';
import {NaturalAbstractList} from '@ecodev/natural';

@Component({
    selector: 'app-changes',
    templateUrl: './changes.component.html',
    styleUrls: ['./changes.component.scss'],
})
export class ChangesComponent extends NaturalAbstractList<ChangeService> {
    public displayedColumns = ['type', 'original', 'suggestion', 'owner', 'creationDate'];

    public constructor(service: ChangeService, injector: Injector) {
        super(service, injector);
    }
}
