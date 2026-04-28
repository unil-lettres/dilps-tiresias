import {Component, inject} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {UsersQuery, UserType} from '../../shared/generated-types';
import {UserService} from '../services/user.service';
import {UserComponent} from '../user/user.component';
import {TypePipe} from '../../shared/pipes/type.pipe';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TableButtonComponent} from '../../shared/components/table-button/table-button.component';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
} from '@angular/material/table';
import {AsyncPipe, DatePipe} from '@angular/common';
import {NaturalEnumPipe, NaturalFixedButtonComponent, NaturalSearchComponent, TypedMatCellDef} from '@ecodev/natural';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
    selector: 'app-users',
    imports: [
        MatToolbar,
        LogoComponent,
        NaturalSearchComponent,
        AsyncPipe,
        DatePipe,
        MatTable,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatColumnDef,
        TypedMatCellDef,
        MatRowDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatSort,
        MatSortHeader,
        TableButtonComponent,
        MatProgressSpinner,
        MatPaginator,
        NaturalFixedButtonComponent,
        NaturalEnumPipe,
        TypePipe,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent extends AbstractList<UserService> {
    public override displayedColumns = ['login', 'name', 'email', 'role', 'type', 'activeUntil'];

    public constructor() {
        super(inject(UserService), UserComponent);
    }

    protected isLegacyUser(user: UsersQuery['users']['items'][0]): boolean {
        return user.type === UserType.Legacy;
    }
}
