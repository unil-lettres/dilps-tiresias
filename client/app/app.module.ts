import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatSortModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router } from '@angular/router';

import { NaturalGalleryModule } from '@ecodev/angular-natural-gallery';
import {
    NaturalAlertModule,
    NaturalDropdownComponentsModule,
    NaturalFixedButtonModule,
    NaturalHierarchicSelectorModule,
    NaturalIconModule,
    NaturalIconsConfig,
    NaturalRelationsModule,
    NaturalSearchModule,
    NaturalSelectEnumModule,
    NaturalSelectModule,
    NaturalTableButtonModule,
} from '@ecodev/natural';
import { NgProgressModule } from '@ngx-progressbar/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ngfModule } from 'angular-file';
import { Apollo, ApolloModule } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { HighchartsChartModule } from 'highcharts-angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { filter } from 'rxjs/operators';
import { AntiqueNameComponent } from './antique-names/antique-name/antique-name.component';
import { AntiqueNamesComponent } from './antique-names/antique-names/antique-names.component';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SITE } from './app.config';
import { ArtistComponent } from './artists/artist/artist.component';
import { ArtistsComponent } from './artists/artists/artists.component';
import { CardComponent } from './card/card.component';
import { ChangeComponent } from './changes/change/change.component';
import { ChangesComponent } from './changes/changes/changes.component';
import { CollectionComponent } from './collections/collection/collection.component';
import { CollectionsComponent } from './collections/collections/collections.component';
import { DocumentTypeComponent } from './document-types/document-type/document-type.component';
import { DocumentTypesComponent } from './document-types/document-types/document-types.component';
import { DomainComponent } from './domains/domain/domain.component';
import { DomainsComponent } from './domains/domains/domains.component';
import { HomeComponent } from './home/home.component';
import { InstitutionComponent } from './institutions/institution/institution.component';
import { InstitutionsComponent } from './institutions/institutions/institutions.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { TermsAgreementComponent } from './login/terms-agreement.component';
import { MaterialComponent } from './materials/material/material.component';
import { MaterialsComponent } from './materials/materials/materials.component';
import { CarouselComponent } from './news/carousel/carousel.component';
import { NewsComponent } from './news/news/news.component';
import { NewsesComponent } from './news/newses/newses.component';
import { PeriodComponent } from './periods/period/period.component';
import { PeriodsComponent } from './periods/periods/periods.component';
import { QuizzComponent } from './quizz/quizz.component';
import { NumberSelectorComponent } from './quizz/shared/number-selector/number-selector.component';
import { AddressComponent } from './shared/components/address/address.component';
import { AlertService } from './shared/components/alert/alert.service';
import { ConfirmComponent } from './shared/components/alert/confirm.component';
import { BootLoaderComponent } from './shared/components/boot-loader/boot-loader.component';
import { CardSelectorComponent } from './shared/components/card-selector/card-selector.component';
import { CollectionSelectorComponent } from './shared/components/collection-selector/collection-selector.component';
import { DialogFooterComponent } from './shared/components/dialog-footer/dialog-footer.component';
import { DownloadComponent } from './shared/components/download/download.component';
import { EmptyComponent } from './shared/components/empty/empty.component';
import { MassEditComponent } from './shared/components/mass-edit/mass-edit.component';
import { StampComponent } from './shared/components/stamp/stamp.component';
import { TableButtonComponent } from './shared/components/table-button/table-button.component';
import { ThesaurusComponent } from './shared/components/thesaurus/thesaurus.component';
import { apolloDefaultOptions } from './shared/config/apollo.default.options';
import { FileDropDirective } from './shared/directives/file-drop.directive';
import { FocusDirective } from './shared/directives/focus';
import { RolePipe } from './shared/pipes/role.pipe';
import { TypePipe } from './shared/pipes/type.pipe';
import { NetworkActivityService } from './shared/services/network-activity.service';
import { StatisticService } from './statistics/services/statistic.service';
import { StatisticComponent } from './statistics/statistic/statistic.component';
import { StatisticsComponent } from './statistics/statistics/statistics.component';
import { TagComponent } from './tags/tag/tag.component';
import { TagsComponent } from './tags/tags/tags.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users/users.component';
import { ViewGridComponent } from './view-grid/view-grid.component';
import { ViewListComponent } from './view-list/view-list.component';
import { ViewMapComponent } from './view-map/view-map.component';

/** Custom options to configure the form field's look and feel */
const formFieldDefaults: MatFormFieldDefaultOptions = {
    appearance: 'fill',
};

const icons: NaturalIconsConfig = {
    material: {
        svg: 'assets/icons/diamond.svg',
    },
    period: {
        font: 'date_range',
    },
    tag: {
        font: 'label',
    },
    'antique-name': {
        svg: 'assets/icons/fire.svg',
    },
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
        EmptyComponent,
        ViewGridComponent,
        ViewMapComponent,
        ViewListComponent,
        CarouselComponent,
        NewsesComponent,
        NewsComponent,
        StatisticsComponent,
        StatisticComponent,
        DomainComponent,
        DomainsComponent,
        DocumentTypesComponent,
        DocumentTypeComponent,
        PeriodComponent,
        PeriodsComponent,
        TagComponent,
        TagsComponent,
        MaterialComponent,
        MaterialsComponent,
        CardSelectorComponent,
        AntiqueNamesComponent,
        AntiqueNameComponent,
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
        NewsComponent,
        DomainComponent,
        DocumentTypeComponent,
        PeriodComponent,
        TagComponent,
        MaterialComponent,
        CardSelectorComponent,
        AntiqueNameComponent,
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
        MatTabsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        MatCardModule,
        ngfModule,
        AgmSnazzyInfoWindowModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBIBMlG6xXDmpPERQgKdo_Dwhtz5SX5dto',
            libraries: ['places'],
        }),
        NaturalDropdownComponentsModule,
        NaturalIconModule.forRoot(icons),
        NaturalRelationsModule,
        NaturalSelectModule,
        NaturalTableButtonModule,
        NaturalAlertModule,
        NaturalFixedButtonModule,
        SwiperModule,
        NaturalHierarchicSelectorModule,
        EditorModule,
        NaturalSelectEnumModule,
        HighchartsChartModule,
        MatSortModule
    ],
    providers: [
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldDefaults},
        {provide: SITE, useValue: window.location.hostname.indexOf('tiresias.') > -1 ? 'tiresias' : 'dilps'},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(apollo: Apollo,
                networkActivityService: NetworkActivityService,
                alertService: AlertService,
                dateAdapter: DateAdapter<Date>,
                statisticService: StatisticService,
                router: Router,
    ) {

        // On each page change, record in stats
        router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
            statisticService.recordPage();
        });

        dateAdapter.setLocale('fr-ch');

        const link = createUploadLink({
            uri: '/graphql',
            credentials: 'include',
        });

        const middleware = new ApolloLink((operation, forward) => {
            networkActivityService.increase();
            return forward(operation).map(response => {
                networkActivityService.decrease();
                return response;
            });
        });

        const errorLink = onError(({graphQLErrors, networkError}) => {

            // Network errors seems not to be catched by above middleware, and we need to be informed to decrease pending queries
            if (networkError) {
                alertService.error('Une erreur est survenue sur le réseau');
                networkActivityService.decrease();
            }

            // Graphql responses with errors are valid responses and are catched by the above middleware.
            // There seems to be no need to do something here
            // Seems we have no need to deal
            if (graphQLErrors) {
                alertService.error('Une erreur est survenue du côté du serveur');
                networkActivityService.updateErrors(graphQLErrors);
            }
        });

        apollo.create({
            link: middleware.concat(errorLink).concat(link),
            cache: new InMemoryCache(),
            defaultOptions: apolloDefaultOptions,
        });
    }

}
