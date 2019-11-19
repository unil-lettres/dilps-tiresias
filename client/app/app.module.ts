import { map } from 'rxjs/operators';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Apollo, ApolloModule } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatFormFieldDefaultOptions,
    DateAdapter,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatExpansionModule,
    MatGridListModule,
} from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgProgressModule } from '@ngx-progressbar/core';

import { AppRoutingModule } from './app-routing.module';
import { DownloadComponent } from './shared/components/download/download.component';
import { AuthGuard } from './shared/services/auth.guard';
import { ThemeService } from './shared/services/theme.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworkActivityService } from './shared/services/network-activity.service';
import { UserService } from './users/services/user.service';

import { AppComponent } from './app.component';
import { UserComponent } from './users/user/user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BootLoaderComponent } from './shared/components/boot-loader/boot-loader.component';
import { ListComponent } from './list/list.component';
import { CardComponent } from './card/card.component';
import { UsersComponent } from './users/users/users.component';
import { TableButtonComponent } from './shared/components/table-button/table-button.component';
import { CollectionsComponent } from './collections/collections/collections.component';
import { UserResolver } from './users/services/user.resolver';
import { FocusDirective } from './shared/directives/focus';
import { CardResolver } from './card/services/card.resolver';
import { CardService } from './card/services/card.service';
import { CollectionComponent } from './collections/collection/collection.component';
import { CollectionService } from './collections/services/collection.service';
import { SelectComponent } from './shared/components/select/select.component';
import { apolloDefaultOptions } from './shared/config/apollo.default.options';
import { onError } from 'apollo-link-error';
import { InstitutionService } from './institutions/services/institution.service';
import { AlertService } from './shared/components/alert/alert.service';
import { ConfirmComponent } from './shared/components/alert/confirm.component';
import { TermsAgreementComponent } from './login/terms-agreement.component';
import { InstitutionsComponent } from './institutions/institutions/institutions.component';
import { InstitutionComponent } from './institutions/institution/institution.component';
import { ArtistComponent } from './artists/artist/artist.component';
import { ArtistsComponent } from './artists/artists/artists.component';
import { ArtistService } from './artists/services/artist.service';
import { ThesaurusComponent } from './shared/components/thesaurus/thesaurus.component';
import { AgmCoreModule } from '@agm/core';
import { AddressComponent } from './shared/components/address/address.component';
import { DialogFooterComponent } from './shared/components/dialog-footer/dialog-footer.component';
import { StampComponent } from './shared/components/stamp/stamp.component';
import { ChangesComponent } from './changes/changes/changes.component';
import { ChangeService } from './changes/services/change.service';
import { ChangeComponent } from './changes/change/change.component';
import { ngfModule } from 'angular-file';
import { UploadService } from './shared/services/upload.service';
import { FileDropDirective } from './shared/directives/file-drop.directive';
import { CollectionSelectorComponent } from './shared/components/collection-selector/collection-selector.component';
import { LinkMutationService } from './shared/services/link-mutation.service';
import { RolePipe } from './shared/pipes/role.pipe';
import { TypePipe } from './shared/pipes/type.pipe';
import { AuthAdminGuard } from './shared/services/auth.admin.guard';
import { QuizzComponent } from './quizz/quizz.component';
import { NumberSelectorComponent } from './quizz/shared/number-selector/number-selector.component';
import { MassEditComponent } from './shared/components/mass-edit/mass-edit.component';
import { RelationsComponent } from './shared/components/relations/relations.component';

import { NaturalGalleryModule } from '@ecodev/angular-natural-gallery';
import { NaturalSearchModule } from '@ecodev/natural-search';

import { environment } from '../environments/environment';

/** Custom options to configure the form field's look and feel */
const formFieldDefaults: MatFormFieldDefaultOptions = {
    appearance: 'legacy'
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        UserComponent,
        HomeComponent,
        BootLoaderComponent,
        ListComponent,
        CardComponent,
        UsersComponent,
        TableButtonComponent,
        CollectionsComponent,
        ConfirmComponent,
        FocusDirective,
        CollectionComponent,
        SelectComponent,
        TermsAgreementComponent,
        InstitutionsComponent,
        InstitutionComponent,
        ArtistComponent,
        ArtistsComponent,
        ThesaurusComponent,
        AddressComponent,
        DialogFooterComponent,
        StampComponent,
        ChangesComponent,
        ChangeComponent,
        FileDropDirective,
        CollectionSelectorComponent,
        DownloadComponent,
        RolePipe,
        TypePipe,
        QuizzComponent,
        NumberSelectorComponent,
        MassEditComponent,
        RelationsComponent,
    ],
    entryComponents: [
        ConfirmComponent,
        UserComponent,
        TermsAgreementComponent,
        InstitutionComponent,
        ArtistComponent,
        CollectionSelectorComponent,
        DownloadComponent,
        CollectionComponent,
        NumberSelectorComponent,
        MassEditComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        ApolloModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        NgProgressModule,
        PerfectScrollbarModule,
        MatInputModule,
        MatSnackBarModule,
        MatSelectModule,
        MatFormFieldModule,
        FlexLayoutModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        NaturalGalleryModule,
        NaturalSearchModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatMenuModule,
        MatDialogModule,
        MatTooltipModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatGridListModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        ngfModule,
        AgmCoreModule.forRoot({
            apiKey: environment.agmApiKey,
            libraries: ['places'],
        }),
    ],
    providers: [
        AuthGuard,
        AuthAdminGuard,
        ThemeService,
        NetworkActivityService,
        CollectionService,
        UserService,
        UserResolver,
        CardResolver,
        CardService,
        AlertService,
        InstitutionService,
        ArtistService,
        ChangeService,
        UploadService,
        LinkMutationService,
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldDefaults },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(apollo: Apollo,
                networkActivitySvc: NetworkActivityService,
                alertSvc: AlertService,
                private dateAdapter: DateAdapter<Date>) {

        dateAdapter.setLocale('fr-ch');

        const link = createUploadLink({
            uri: '/graphql',
            credentials: 'include',
        });

        const middleware = new ApolloLink((operation, forward) => {
            networkActivitySvc.increase();
            return forward(operation).map(response => {
                networkActivitySvc.decrease();
                return response;
            });
        });

        const errorLink = onError(({graphQLErrors, networkError}) => {

            // Network errors seems not to be catched by above middleware, and we need to be informed to decrease pending queries
            if (networkError) {
                alertSvc.error('Une erreur est survenue sur le réseau');
                networkActivitySvc.decrease();
            }

            // Graphql responses with errors are valid responses and are catched by the above middleware.
            // There seems to be no need to do something here
            // Seems we have no need to deal
            if (graphQLErrors) {
                alertSvc.error('Une erreur est survenue du côté du serveur');
                networkActivitySvc.updateErrors(graphQLErrors);
            }
        });

        apollo.create({
            link: middleware.concat(errorLink).concat(link),
            cache: new InMemoryCache(),
            defaultOptions: apolloDefaultOptions,
        });
    }

}
