import {Inject, Injectable, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {fromEvent, Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {SITE} from '../../app.config';
import {
    Cards_cards_items,
    CardVisibility,
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
    User_user,
    UserInput,
    UserRole,
    UserRolesAvailables,
    UserRolesAvailablesVariables,
    Users,
    UsersVariables,
    UserType,
    UserVariables,
    Viewer,
    Viewer_viewer,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {
    createUser,
    deleteUsers,
    loginMutation,
    logoutMutation,
    updateUser,
    userQuery,
    userRolesAvailableQuery,
    usersQuery,
    viewerQuery,
} from './user.queries';
import {LOCAL_STORAGE, NaturalStorage} from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class UserService
    extends AbstractContextualizedService<
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
    >
    implements OnDestroy {
    /**
     * This key will be used to store the viewer ID, but that value should never
     * be trusted, and it only exist to notify changes across browser tabs.
     */
    private readonly storageKey = 'viewer';
    private readonly onDestroy = new Subject<void>();

    constructor(
        apollo: Apollo,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(SITE) site: Site,
        @Inject(LOCAL_STORAGE) private readonly storage: NaturalStorage,
    ) {
        super(apollo, 'user', userQuery, usersQuery, createUser, updateUser, deleteUsers, site);
        this.keepViewerSyncedAcrossBrowserTabs();
    }

    public static canSuggestUpdate(user: Viewer_viewer | null, card: Cards_cards_items | null): boolean {
        return (
            user && card && ((card.owner && user.id !== card.owner.id) || card.visibility !== CardVisibility.private)
        );
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
            .query<Viewer, never>({
                query: viewerQuery,
                fetchPolicy: 'cache-first',
            })
            .pipe(map(result => result.data.viewer));
    }

    public getUserRolesAvailable(user: User_user | null): Observable<UserRole[]> {
        return this.apollo
            .query<UserRolesAvailables, UserRolesAvailablesVariables>({
                query: userRolesAvailableQuery,
                variables: {
                    user: user?.id,
                },
            })
            .pipe(
                map(result => {
                    return result.data.userRolesAvailable;
                }),
            );
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

    public ngOnDestroy(): void {
        this.onDestroy.next();
        this.onDestroy.complete();
    }

    private keepViewerSyncedAcrossBrowserTabs(): void {
        fromEvent<StorageEvent>(window, 'storage')
            .pipe(takeUntil(this.onDestroy))
            .subscribe(event => {
                if (event.key !== this.storageKey) {
                    return;
                }

                this.apollo
                    .query<Viewer, never>({
                        query: viewerQuery,
                        fetchPolicy: 'network-only',
                    })
                    .pipe(map(result => result.data.viewer))
                    .subscribe(viewer => {
                        if (viewer) {
                            this.apollo.client.resetStore().then(() => {
                                this.postLogin(viewer);

                                // Navigate away from login page
                                this.router.navigateByUrl('/home');
                            });
                        } else {
                            this.logout();
                        }
                    });
            });
    }

    public login(loginData: LoginVariables): Observable<Login['login']> {
        const subject = new Subject<Login['login']>();

        // Be sure to destroy all Apollo data, before changing user
        this.apollo.client.resetStore().then(() => {
            this.apollo
                .mutate<Login, LoginVariables>({
                    mutation: loginMutation,
                    variables: loginData,
                })
                .pipe(
                    map(result => {
                        const viewer = result.data!.login;
                        this.postLogin(viewer);

                        return viewer;
                    }),
                )
                .subscribe(subject);
        });

        return subject;
    }

    private postLogin(viewer: Viewer_viewer): void {
        // Inject the freshly logged in user as the current user into Apollo data store
        const data = {viewer: viewer};
        this.apollo.client.writeQuery<Viewer, never>({
            query: viewerQuery,
            data,
        });

        // Broadcast viewer to other browser tabs
        this.storage.setItem(this.storageKey, viewer.id);
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
                    // Broadcast logout to other browser tabs
                    this.storage.setItem(this.storageKey, '');

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
