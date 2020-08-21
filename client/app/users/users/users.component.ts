import {Component, Injector} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {Users, UsersVariables, UserType} from '../../shared/generated-types';
import {UserService} from '../services/user.service';
import {UserComponent} from '../user/user.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends AbstractList<Users['users'], UsersVariables> {
    public displayedColumns = ['login', 'name', 'email', 'role', 'type', 'activeUntil'];

    constructor(service: UserService, injector: Injector) {
        super(service, UserComponent, injector);
    }

    public isLegacyUser(user) {
        return user.type === UserType.legacy;
    }
}
