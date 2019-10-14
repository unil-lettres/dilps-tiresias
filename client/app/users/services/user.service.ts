import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SITE } from '../../app.config';
import {
    CreateUser,
    CreateUserVariables,
    DeleteUsers,
    Login,
    Logout,
    Site,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserRole,
    Users,
    UsersVariables,
    UserType,
    UserVariables,
    Viewer,
} from '../../shared/generated-types';
import { AbstractContextualizedService } from '../../shared/services/AbstractContextualizedService';
import { createUser, deleteUsers, loginMutation, logoutMutation, updateUser, userQuery, usersQuery, viewerQuery } from './user.queries';

@Injectable({
    providedIn: 'root',
})
export class UserService extends AbstractContextualizedService<User['user'],
    UserVariables,
    Users['users'],
    UsersVariables,
    CreateUser['createUser'],
    CreateUserVariables,
    UpdateUser['updateUser'],
    UpdateUserVariables,
    DeleteUsers['deleteUsers']> {

    private currentUser: Viewer['viewer'] | null = null;

    constructor(apollo: Apollo, private router: Router, @Inject(SITE) site: Site) {
        super(apollo, 'user', userQuery, usersQuery, createUser, updateUser, deleteUsers, site);
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

    public getCurrentUser(): Observable<Viewer['viewer']> {

        if (this.currentUser) {
            return of(this.currentUser);
        }

        return this.apollo.query<Viewer>({
            query: viewerQuery,
        }).pipe(map(({data: {viewer}}) => {
            this.currentUser = viewer;
            return viewer;
        }));
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

    public login(loginData): Observable<Login['login']> {
        return this.apollo.mutate<Login>({
            mutation: loginMutation,
            variables: loginData,
        }).pipe(map(result => result.data.login));
    }

    public logout(): Observable<Logout['logout']> {
        const subject = new Subject<Logout['logout']>();

        this.router.navigate(['/login'], {queryParams: {logout: true}}).then(() => {
            this.apollo.mutate<Logout>({
                mutation: logoutMutation,
            }).pipe(map(result => result.data.logout)).subscribe((v) => {
                this.currentUser = null;
                (this.apollo.getClient().resetStore() as Promise<null>).then(() => {
                    subject.next(v);
                });
            });
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
