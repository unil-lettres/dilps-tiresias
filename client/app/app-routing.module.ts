import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistsComponent } from './artists/artists/artists.component';
import { CardComponent } from './card/card.component';
import { CardResolver } from './card/services/card.resolver';
import { ChangeComponent } from './changes/change/change.component';
import { ChangesComponent } from './changes/changes/changes.component';
import { CollectionsComponent } from './collections/collections/collections.component';
import { FakeCollectionResolver } from './collections/services/fake-collection.resolver';
import { DocumentTypesComponent } from './document-types/document-types/document-types.component';
import { DomainsComponent } from './domains/domains/domains.component';
import { HomeComponent } from './home/home.component';
import { InstitutionsComponent } from './institutions/institutions/institutions.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { MaterialsComponent } from './materials/materials/materials.component';
import { NewsesComponent } from './news/newses/newses.component';
import { PeriodsComponent } from './periods/periods/periods.component';
import { QuizzComponent } from './quizz/quizz.component';
import { EmptyComponent } from './shared/components/empty/empty.component';
import { CardFilterGroupCondition, CollectionFilterGroupCondition, CollectionVisibility, UserRole } from './shared/generated-types';
import { AuthAdminGuard } from './shared/services/auth.admin.guard';
import { AuthGuard } from './shared/services/auth.guard';
import { TagsComponent } from './tags/tags/tags.component';
import { UserResolver } from './users/services/user.resolver';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users/users.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },

    // Auth required routes
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        resolve: {user: UserResolver},
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
                path: 'card/new',
                component: CardComponent,
                data: {showLogo: true},
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'card/:cardId',
                component: CardComponent,
                resolve: {card: CardResolver},
                data: {showLogo: true},
            },
            {
                path: 'profile',
                component: UserComponent,
            },
            {
                path: 'user',
                component: UsersComponent,
                canActivate: [AuthAdminGuard],
            },
            {
                path: 'institution',
                component: InstitutionsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'artist',
                component: ArtistsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'tag',
                component: TagsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'material',
                component: MaterialsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'domain',
                component: DomainsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'period',
                component: PeriodsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'document-type',
                component: DocumentTypesComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'newses',
                component: NewsesComponent,
                canActivate: [AuthGuard],
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
                    editionButtonsForRoles: [
                        UserRole.administrator,
                        UserRole.senior,
                    ],
                    filter: {
                        groups: [
                            {
                                conditions: [
                                    {
                                        isSource: {equal: {value: false}},
                                        visibility: {
                                            in: {
                                                values: [
                                                    CollectionVisibility.administrator,
                                                    CollectionVisibility.member,
                                                ],
                                            },
                                        },
                                    } as CollectionFilterGroupCondition,
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
                            collection: FakeCollectionResolver,
                        },
                    },
                ],
            },
            {
                path: 'my-collection',
                component: CollectionsComponent,
                resolve: {creator: UserResolver},
                data: {
                    creationButtonForRoles: true,
                    showLogo: false,
                    showUnclassified: true,
                    showMyCards: true,
                    filter: {groups: [{conditions: [{isSource: {equal: {value: false}}} as CollectionFilterGroupCondition]}]},
                },
                children: [
                    {
                        path: '',
                        component: ListComponent,
                        data: {
                            filter: {groups: [{conditions: [{collections: {empty: {}}} as CardFilterGroupCondition]}]},
                        },
                    },
                    {
                        path: 'my-cards',
                        component: ListComponent,
                        resolve: {creator: UserResolver},
                    },
                    {
                        path: ':collectionId',
                        component: ListComponent,
                        resolve: {
                            collection: FakeCollectionResolver,
                        },
                    },
                ],
            },
            {
                path: 'source',
                component: CollectionsComponent,
                data: {
                    creationButtonForRoles: [UserRole.administrator],
                    editionButtonsForRoles: [UserRole.administrator],
                    filter: {groups: [{conditions: [{isSource: {equal: {value: true}}} as CollectionFilterGroupCondition]}]},
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
                            collection: FakeCollectionResolver,
                        },
                    },
                ],
            },
            {
                path: 'empty',
                component: EmptyComponent,
            },
        ],
    },

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            paramsInheritanceStrategy: 'emptyOnly',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
