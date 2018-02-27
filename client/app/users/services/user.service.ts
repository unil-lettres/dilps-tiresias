import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import {
    CreateUserMutation,
    DeleteUsersMutation,
    UpdateUserMutation,
    UserInput,
    UserQuery,
    UsersQuery,
    UserType,
    LoginMutation, ViewerQuery, LogoutMutation,
} from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import {
    createUserMutation,
    deleteUsersMutation,
    updateUserMutation,
    userQuery,
    usersQuery,
    loginMutation,
    logoutMutation,
    viewerQuery,
} from './userQueries';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService extends AbstractModelService<UserQuery['user'],
    UsersQuery['users'],
    CreateUserMutation['createUser'],
    UpdateUserMutation['updateUser'],
    DeleteUsersMutation['deleteUsers']> {

    private currentUser;

    constructor(apollo: Apollo, private router: Router) {
        super(apollo, 'user', userQuery, usersQuery, createUserMutation, updateUserMutation, deleteUsersMutation);
    }

    public getEmptyObject(): UserInput {
        return {
            login: '',
            email: '',
            activeUntil: '',
            termsAgreement: null,
            type: UserType.default,
            institution: null,
        };
    }

    public getCurrentUser(): Observable<ViewerQuery['viewer']> {
        return this.apollo.watchQuery<ViewerQuery>({
            query: viewerQuery,
            fetchPolicy: 'network-only',
        }).valueChanges.pipe(map(result => result.data ? result.data.viewer : null));
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

}
