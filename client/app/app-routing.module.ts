import {Routes} from '@angular/router';
import {AntiqueNamesComponent} from './antique-names/antique-names/antique-names.component';
import {ArtistsComponent} from './artists/artists/artists.component';
import {CardComponent} from './card/card.component';
import {ChangeComponent} from './changes/change/change.component';
import {ChangesComponent} from './changes/changes/changes.component';
import {CollectionsComponent} from './collections/collections/collections.component';
import {resolveFakeCollection} from './collections/services/fake-collection.resolver';
import {DocumentTypesComponent} from './document-types/document-types/document-types.component';
import {DomainsComponent} from './domains/domains/domains.component';
import {HomeComponent} from './home/home.component';
import {InstitutionsComponent} from './institutions/institutions/institutions.component';
import {ListComponent} from './list/list.component';
import {LoginComponent} from './login/login.component';
import {MaterialsComponent} from './materials/materials/materials.component';
import {NewsesComponent} from './news/newses/newses.component';
import {PeriodsComponent} from './periods/periods/periods.component';
import {QuizzComponent} from './quizz/quizz.component';
import {EmptyComponent} from './shared/components/empty/empty.component';
import {
    CardFilterGroupCondition,
    CollectionFilterGroupCondition,
    CollectionVisibility,
    UserRole,
} from './shared/generated-types';
import {canActivateAuthAdmin} from './shared/services/auth.admin.guard';
import {canActivateAuth} from './shared/services/auth.guard';
import {StatisticsComponent} from './statistics/statistics/statistics.component';
import {TagsComponent} from './tags/tags/tags.component';
import {resolveUser} from './users/services/user.resolver';
import {UserComponent} from './users/user/user.component';
import {UsersComponent} from './users/users/users.component';
import {ErrorComponent} from './shared/components/error/error.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'error',
        component: ErrorComponent,
    },
    // Auth required routes
    {
        path: '',
        component: HomeComponent,
        canActivate: [canActivateAuth],
        resolve: {user: resolveUser},
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
            {
                path: 'home',
                component: ListComponent,
                data: {
                    showLogo: true,
                    forceSearch: true,
                },
            },
            {
                path: 'card/:cardId',
                component: CardComponent,
                data: {showLogo: true, showSlideshowRelatedCards: true},
            },
            {
                path: 'profile',
                component: UserComponent,
            },
            {
                path: 'user',
                component: UsersComponent,
                canActivate: [canActivateAuthAdmin],
            },
            {
                path: 'institution',
                component: InstitutionsComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'artist',
                component: ArtistsComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'antique-name',
                component: AntiqueNamesComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'tag',
                component: TagsComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'material',
                component: MaterialsComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'domain',
                component: DomainsComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'period',
                component: PeriodsComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'document-type',
                component: DocumentTypesComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'news',
                component: NewsesComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'statistic',
                component: StatisticsComponent,
                canActivate: [canActivateAuth],
            },
            {
                path: 'notification',
                component: ChangesComponent,
            },
            {
                path: 'notification/new/:cardId',
                component: ChangeComponent,
            },
            {
                path: 'notification/:changeId',
                component: ChangeComponent,
            },
            {
                path: 'quizz',
                component: QuizzComponent,
            },
            {
                path: 'collection',
                component: CollectionsComponent,
                data: {
                    creationButtonForRoles: false,
                    // editionButtonsForRoles: [UserRole.administrator, UserRole.senior],
                    filter: {
                        groups: [
                            {
                                conditions: [
                                    {
                                        isSource: {equal: {value: false}},
                                        visibility: {
                                            in: {
                                                values: [
                                                    CollectionVisibility.Administrator,
                                                    CollectionVisibility.Member,
                                                ],
                                            },
                                        },
                                    } satisfies CollectionFilterGroupCondition,
                                ],
                            },
                        ],
                    },
                },
                children: [
                    {
                        path: ':collectionId',
                        component: ListComponent,
                        data: {
                            showLogo: false,
                            showDownloadCollectionForRoles: [UserRole.administrator],
                        },
                        resolve: {
                            collection: resolveFakeCollection,
                        },
                    },
                ],
            },
            {
                path: 'my-collection',
                component: CollectionsComponent,
                resolve: {creator: resolveUser},
                data: {
                    creationButtonForRoles: true,
                    showLogo: false,
                    showUnclassified: true,
                    showMyCards: true,
                    filter: {
                        groups: [
                            {
                                conditions: [
                                    {isSource: {equal: {value: false}}} satisfies CollectionFilterGroupCondition,
                                ],
                            },
                        ],
                    },
                },
                children: [
                    {
                        // Redirect to next route. Angular router dislikes usage of navigation with empty path
                        path: '',
                        pathMatch: 'full',
                        redirectTo: '/my-collection/unclassified',
                    },
                    {
                        path: 'unclassified',
                        component: ListComponent,
                        resolve: {creator: resolveUser},
                        data: {
                            filter: {
                                groups: [{conditions: [{collections: {empty: {}}} satisfies CardFilterGroupCondition]}],
                            },
                        },
                    },
                    {
                        path: 'my-cards',
                        component: ListComponent,
                        resolve: {creator: resolveUser},
                    },
                    {
                        path: ':collectionId',
                        component: ListComponent,
                        resolve: {
                            collection: resolveFakeCollection,
                        },
                    },
                ],
            },
            {
                path: 'source',
                component: CollectionsComponent,
                data: {
                    creationButtonForRoles: [UserRole.administrator],
                    // editionButtonsForRoles: [UserRole.administrator],
                    filter: {
                        groups: [
                            {conditions: [{isSource: {equal: {value: true}}} satisfies CollectionFilterGroupCondition]},
                        ],
                    },
                },
                children: [
                    {
                        path: ':collectionId',
                        component: ListComponent,
                        data: {
                            showDownloadCollectionForRoles: [UserRole.administrator],
                            showLogo: false,
                            filter: {}, // overrides parent
                        },
                        resolve: {
                            collection: resolveFakeCollection,
                        },
                    },
                ],
            },
            {
                path: 'empty',
                component: EmptyComponent,
            },
            {
                path: '**',
                component: ErrorComponent,
                data: {notFound: true},
            },
        ],
    },
];
