import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {SITE} from '../../app.config';
import {
    CreateUser,
    CreateUserVariables,
    DeleteUsers,
    Login,
    LoginVariables,
    Logout,
    Site,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserInput,
    UserRole,
    Users,
    UsersVariables,
    UserType,
    UserVariables,
    Viewer,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {
    createUser,
    deleteUsers,
    loginMutation,
    logoutMutation,
    updateUser,
    userQuery,
    usersQuery,
    viewerQuery,
} from './user.queries';

@Injectable({
    providedIn: 'root',
})
export class UserService extends AbstractContextualizedService<
    User['user'],
    UserVariables,
    Users['users'],
    UsersVariables,
    CreateUser['createUser'],
    CreateUserVariables,
    UpdateUser['updateUser'],
    UpdateUserVariables,
    DeleteUsers['deleteUsers'],
    never
> {
    constructor(apollo: Apollo, private route: ActivatedRoute, private router: Router, @Inject(SITE) site: Site) {
        super(apollo, 'user', userQuery, usersQuery, createUser, updateUser, deleteUsers, site);
    }

    public getDefaultForClient(): UserInput {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): UserInput {
        return {
            site: this.site,
            login: '',
            name: '',
            email: null,
            activeUntil: '',
            termsAgreement: null,
            type: UserType.default,
            role: UserRole.student,
            institution: null,
            password: '',
        };
    }

    public getCurrentUser(): Observable<Viewer['viewer']> {
        return this.apollo
            .query<Viewer>({
                query: viewerQuery,
                fetchPolicy: 'cache-first',
            })
            .pipe(map(result => result.data.viewer));
    }

    public getRole(role: UserRole): {name: UserRole; text: string} {
        return this.getRoles().find(r => r.name === role);
    }

    public getRoles(): {name: UserRole; text: string}[] {
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
                name: UserRole.major,
                text: 'Major',
            },
            {
                name: UserRole.administrator,
                text: 'Administrateur',
            },
        ];
    }

    public getType(type: UserType): {name: UserType; text: string} {
        return this.getTypes().find(t => t.name === type);
    }

    public getTypes(): {name: UserType; text: string}[] {
        return [
            {
                name: UserType.aai,
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

    public login(loginData: LoginVariables): Observable<Login['login']> {
        return this.apollo
            .mutate<Login, LoginVariables>({
                mutation: loginMutation,
                variables: loginData,
                update: (proxy, result) => {
                    const login = result.data!.login;

                    // Inject the freshly logged in user as the current user into Apollo data store
                    const data = {viewer: login};
                    proxy.writeQuery({
                        query: viewerQuery,
                        data,
                    });
                },
            })
            .pipe(map(result => result.data!.login));
    }

    public logout(): Observable<Logout['logout']> {
        const subject = new Subject<Logout['logout']>();

        this.apollo
            .mutate<Logout>({
                mutation: logoutMutation,
            })
            .subscribe(result => {
                const v = result.data!.logout;
                this.apollo.client.clearStore().then(() => {
                    this.router.navigate(['/login'], {queryParams: {logout: true}}).then(() => {
                        subject.next(v);
                    });
                });
            });

        return subject;
    }

    public hasTempAccess(): boolean {
        return sessionStorage.getItem('tempAccess') === 'true';
    }

    public startTempAccess(): void {
        sessionStorage.setItem('tempAccess', 'true');
        this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl || '/');
    }

    public revokeTempAccess(): void {
        sessionStorage.removeItem('tempAccess');
        this.router.navigateByUrl('login');
    }
}
