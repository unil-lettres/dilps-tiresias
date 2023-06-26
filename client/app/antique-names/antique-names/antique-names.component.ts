import {Component} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {AntiqueNameComponent} from '../antique-name/antique-name.component';
import {AntiqueNameService} from '../services/antique-name.service';

@Component({
    selector: 'app-antique-names',
    templateUrl: './antique-names.component.html',
    styleUrls: ['./antique-names.component.scss'],
})
export class AntiqueNamesComponent extends AbstractList<AntiqueNameService> {
    public constructor(service: AntiqueNameService) {
        super(service, AntiqueNameComponent);
    }
}
