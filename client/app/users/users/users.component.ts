import {Component, inject} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {Users, UserType} from '../../shared/generated-types';
import {UserService} from '../services/user.service';
import {UserComponent} from '../user/user.component';
import {TypePipe} from '../../shared/pipes/type.pipe';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {NaturalSearchComponent, NaturalFixedButtonComponent, NaturalEnumPipe} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    standalone: true,
    imports: [
        MatToolbarModule,
        LogoComponent,
        NaturalSearchComponent,
        CommonModule,
        MatTableModule,
        MatSortModule,
        TableButtonComponent,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalFixedButtonComponent,
        NaturalEnumPipe,
        TypePipe,
    ],
})
export class UsersComponent extends AbstractList<UserService> {
    public override displayedColumns = ['login', 'name', 'email', 'role', 'type', 'activeUntil'];

    public constructor() {
        const service = inject(UserService);

        super(service, UserComponent);
    }

    public isLegacyUser(user: Users['users']['items'][0]): boolean {
        return user.type === UserType.legacy;
    }
}
