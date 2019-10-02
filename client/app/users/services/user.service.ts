import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    CreateUserMutation,
    DeleteUsersMutation,
    LoginMutation,
    LogoutMutation,
    UpdateUserMutation,
    UserQuery,
    UserRole,
    UsersQuery,
    UserType,
    ViewerQuery,
} from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import {
    createUserMutation,
    deleteUsersMutation,
    loginMutation,
    logoutMutation,
    updateUserMutation,
    userQuery,
    usersQuery,
    viewerQuery,
} from './userQueries';

@Injectable({
    providedIn: 'root',
})
export class UserService extends AbstractModelService<UserQuery['user'],
    UsersQuery['users'],
    CreateUserMutation['createUser'],
    UpdateUserMutation['updateUser'],
    DeleteUsersMutation['deleteUsers']> {

    constructor(apollo: Apollo, private router: Router) {
        super(apollo, 'user', userQuery, usersQuery, createUserMutation, updateUserMutation, deleteUsersMutation);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            login: '',
            email: '',
            activeUntil: '',
            termsAgreement: null,
            type: UserType.default,
            role: UserRole.student,
            institution: null,
            password: '',
        };
    }

    public getCurrentUser(): Observable<ViewerQuery['viewer']> {
        return this.apollo.query<ViewerQuery>({
            query: viewerQuery,
            fetchPolicy: 'network-only',
        }).pipe(map(result => result.data ? result.data.viewer : null));
    }

    public getRole(role: UserRole) {
        return this.getRoles().find(r => r.name === role);
    }

    public getRoles() {
        return [
            {
                name: UserRole.student,
                text: 'Etudiant',
            },
            {
                name: UserRole.junior,
                text: 'Etudiant junior',
            },
            {
                name: UserRole.senior,
                text: 'Senior',
            },
            {
                name: UserRole.administrator,
                text: 'Administrateur',
            },
        ];
    }

    public getType(type: UserType) {
        return this.getTypes().find(t => t.name === type);
    }

    public getTypes() {
        return [
            {
                name: UserType.unil,
                text: 'AAI',
            },
            {
                name: UserType.default,
                text: 'Externe',
            },
            {
                name: UserType.legacy,
                text: 'Legacy',
            },
        ];
    }

    public login(loginData): Observable<LoginMutation['login']> {
        return this.apollo.mutate<LoginMutation>({
            mutation: loginMutation,
            variables: loginData,
        }).pipe(map(result => result.data.login));
    }

    public logout(): Observable<LogoutMutation['logout']> {
        const subject = new Subject<LogoutMutation['logout']>();

        this.router.navigate(['/login'], {queryParams: {logout: true}}).then(() => {
            this.apollo.mutate<LogoutMutation>({
                mutation: logoutMutation,
            }).pipe(map(result => result.data.logout)).subscribe((v) => (this.apollo.getClient().resetStore() as Promise<null>).then(() => {
                subject.next(v);
            }));
        });

        return subject;
    }

    public hasTempAccess() {
        return sessionStorage.getItem('tempAccess') === 'true';
    }

    public startTempAccess() {
        sessionStorage.setItem('tempAccess', 'true');
        this.router.navigateByUrl('/');
    }

    public revokeTempAccess() {
        sessionStorage.removeItem('tempAccess');
        this.router.navigateByUrl('login');
    }

}
