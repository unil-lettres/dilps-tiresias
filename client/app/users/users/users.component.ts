import {Component} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {Users, UserType} from '../../shared/generated-types';
import {UserService} from '../services/user.service';
import {UserComponent} from '../user/user.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends AbstractList<UserService> {
    public override displayedColumns = ['login', 'name', 'email', 'role', 'type', 'activeUntil'];

    public constructor(service: UserService) {
        super(service, UserComponent);
    }

    public isLegacyUser(user: Users['users']['items'][0]): boolean {
        return user.type === UserType.legacy;
    }
}
