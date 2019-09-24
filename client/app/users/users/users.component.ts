import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AbstractList } from '../../shared/components/AbstractList';
import { UserService } from '../services/user.service';
import { UserComponent } from '../user/user.component';
import {UserType} from '../../shared/generated-types';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends AbstractList implements OnInit {

    public displayedColumns = [
        'name',
        'email',
        'role',
        'type',
        'activeUntil'
    ];
    constructor(service: UserService,
                router: Router,
                route: ActivatedRoute,
                dialog: MatDialog) {

        super('users', service, UserComponent, router, route, dialog);

    }

    public isLegacyUser(user) {
        return user.type === UserType.legacy;
    }
}
