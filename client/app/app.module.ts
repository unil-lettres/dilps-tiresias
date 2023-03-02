import {Apollo, ApolloModule} from 'apollo-angular';
import {InMemoryCache} from '@apollo/client/core';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {NgModule, ErrorHandler} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {
    MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatLegacyFormFieldDefaultOptions as MatFormFieldDefaultOptions,
    MatLegacyFormFieldModule as MatFormFieldModule,
} from '@angular/material/legacy-form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacySliderModule as MatSliderModule} from '@angular/material/legacy-slider';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {
    MAT_LEGACY_TOOLTIP_DEFAULT_OPTIONS as MAT_TOOLTIP_DEFAULT_OPTIONS,
    MatLegacyTooltipDefaultOptions as MatTooltipDefaultOptions,
    MatLegacyTooltipModule as MatTooltipModule,
} from '@angular/material/legacy-tooltip';
import {MatGridListModule} from '@angular/material/grid-list';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationEnd, Router, RouteReuseStrategy} from '@angular/router';
import {NaturalGalleryModule} from '@ecodev/angular-natural-gallery';
import {
    Literal,
    NaturalAlertModule,
    NaturalCommonModule,
    NaturalDropdownComponentsModule,
    NaturalFileModule,
    NaturalFixedButtonModule,
    NaturalHierarchicSelectorModule,
    NaturalIconModule,
    NaturalIconsConfig,
    NaturalRelationsModule,
    NaturalSearchModule,
    NaturalSelectModule,
    NaturalTableButtonModule,
} from '@ecodev/natural';
import {NgProgressModule} from 'ngx-progressbar';
import {HighchartsChartModule} from 'highcharts-angular';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {SwiperModule} from 'swiper/angular';
import {filter} from 'rxjs/operators';
import {AntiqueNameComponent} from './antique-names/antique-name/antique-name.component';
import {AntiqueNamesComponent} from './antique-names/antique-names/antique-names.component';
import {AppRouteReuseStrategy} from './app-route-reuse-strategy';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SITE} from './app.config';
import {ArtistComponent} from './artists/artist/artist.component';
import {ArtistsComponent} from './artists/artists/artists.component';
import {CardComponent} from './card/card.component';
import {ChangeComponent} from './changes/change/change.component';
import {ChangesComponent} from './changes/changes/changes.component';
import {CollectionComponent} from './collections/collection/collection.component';
import {CollectionsComponent} from './collections/collections/collections.component';
import {DocumentTypeComponent} from './document-types/document-type/document-type.component';
import {DocumentTypesComponent} from './document-types/document-types/document-types.component';
import {DomainComponent} from './domains/domain/domain.component';
import {DomainsComponent} from './domains/domains/domains.component';
import {HomeComponent} from './home/home.component';
import {InstitutionComponent} from './institutions/institution/institution.component';
import {InstitutionsComponent} from './institutions/institutions/institutions.component';
import {ListComponent} from './list/list.component';
import {LoginComponent} from './login/login.component';
import {TermsAgreementComponent} from './login/terms-agreement.component';
import {WelcomeComponent} from './home/welcome.component';
import {MaterialComponent} from './materials/material/material.component';
import {MaterialsComponent} from './materials/materials/materials.component';
import {CarouselComponent} from './news/carousel/carousel.component';
import {NewsComponent} from './news/news/news.component';
import {NewsesComponent} from './news/newses/newses.component';
import {PeriodComponent} from './periods/period/period.component';
import {PeriodsComponent} from './periods/periods/periods.component';
import {QuizzComponent} from './quizz/quizz.component';
import {NumberSelectorComponent} from './quizz/shared/number-selector/number-selector.component';
import {AddressComponent} from './shared/components/address/address.component';
import {AlertService} from './shared/components/alert/alert.service';
import {ConfirmComponent} from './shared/components/alert/confirm.component';
import {BootLoaderComponent} from './shared/components/boot-loader/boot-loader.component';
import {CardSelectorComponent} from './shared/components/card-selector/card-selector.component';
import {CollectionSelectorComponent} from './shared/components/collection-selector/collection-selector.component';
import {DialogFooterComponent} from './shared/components/dialog-footer/dialog-footer.component';
import {DownloadComponent} from './shared/components/download/download.component';
import {LogoComponent} from './shared/components/logo/logo.component';
import {EmptyComponent} from './shared/components/empty/empty.component';
import {MassEditComponent} from './shared/components/mass-edit/mass-edit.component';
import {StampComponent} from './shared/components/stamp/stamp.component';
import {TableButtonComponent} from './shared/components/table-button/table-button.component';
import {ThesaurusComponent} from './shared/components/thesaurus/thesaurus.component';
import {apolloDefaultOptions, createApolloLink} from './shared/config/apollo.link.creator';
import {TruncatePipe} from './shared/pipes/truncate.pipe';
import {TypePipe} from './shared/pipes/type.pipe';
import {NetworkActivityService} from './shared/services/network-activity.service';
import {StatisticService} from './statistics/services/statistic.service';
import {StatisticComponent} from './statistics/statistic/statistic.component';
import {StatisticsComponent} from './statistics/statistics/statistics.component';
import {TagComponent} from './tags/tag/tag.component';
import {TagsComponent} from './tags/tags/tags.component';
import {UserComponent} from './users/user/user.component';
import {UsersComponent} from './users/users/users.component';
import {ViewGridComponent} from './view-grid/view-grid.component';
import {ViewListComponent} from './view-list/view-list.component';
import {ViewMapComponent} from './view-map/view-map.component';
import {QuillModule} from 'ngx-quill';
import {quillConfig} from './shared/config/quill.options';
import {bugsnagErrorHandlerFactory} from './shared/config/bugsnag';
import {UrlValidatorDirective} from './shared/directives/url-validator.directive';
import {UniqueCodeValidatorDirective} from './shared/directives/unique-code-validator.directive';
import {StripTagsPipe} from './shared/pipes/strip-tags.pipe';
import {OnlyLeavesPipe} from './shared/pipes/only-leaves.pipe';
import {TypeLocationComponent} from './type-location/type-location.component';
import {TypeNumericRangeComponent} from './type-numeric-range/type-numeric-range.component';
import {FilesComponent} from './files/files/files.component';
import {ErrorComponent} from './shared/components/error/error.component';
import {NetworkInterceptorService} from './shared/services/network-interceptor.service';
import {HttpBatchLink} from 'apollo-angular/http';
import {GoogleMapsModule} from '@angular/google-maps';
import {HideTooltipDirective} from './shared/directives/hide-tooltip.directive';

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
    font_download: {
        svg: 'assets/icons/font_download.svg',
    },
    font_download_off: {
        svg: 'assets/icons/font_download_off.svg',
    },
};

export const matTooltipCustomConfig: MatTooltipDefaultOptions = {
    showDelay: 5,
    hideDelay: 5,
    touchendHideDelay: 5,
    touchGestures: 'off',
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
        UrlValidatorDirective,
        HideTooltipDirective,
        UniqueCodeValidatorDirective,
        CollectionComponent,
        TermsAgreementComponent,
        WelcomeComponent,
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
        CollectionSelectorComponent,
        DownloadComponent,
        LogoComponent,
        TypePipe,
        StripTagsPipe,
        OnlyLeavesPipe,
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
        TypeLocationComponent,
        TypeNumericRangeComponent,
        TruncatePipe,
        FilesComponent,
        ErrorComponent,
    ],
    imports: [
        ApolloModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        HttpClientJsonpModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule.withConfig({
            // Disable animations if not supported (on iPhone 6 / Safari 13)
            disableAnimations:
                !('animate' in document.documentElement) ||
                (navigator && /iPhone OS (8|9|10|11|12|13)_/.test(navigator.userAgent)),
        }),
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
        MatCardModule,
        GoogleMapsModule,
        NaturalDropdownComponentsModule,
        NaturalIconModule.forRoot(icons),
        NaturalRelationsModule,
        NaturalSelectModule,
        NaturalTableButtonModule,
        NaturalAlertModule,
        NaturalFixedButtonModule,
        SwiperModule,
        NaturalHierarchicSelectorModule,
        HighchartsChartModule,
        MatSortModule,
        QuillModule.forRoot(quillConfig),
        NaturalCommonModule,
        NaturalFileModule,
    ],
    providers: [
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldDefaults},
        {provide: SITE, useValue: (window as Literal)['APP_SITE']}, // As defined in client/index.html
        {provide: ErrorHandler, useFactory: bugsnagErrorHandlerFactory},
        {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy},
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: matTooltipCustomConfig},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NetworkInterceptorService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    public constructor(
        apollo: Apollo,
        networkActivityService: NetworkActivityService,
        alertService: AlertService,
        dateAdapter: DateAdapter<Date>,
        statisticService: StatisticService,
        router: Router,
        routeReuse: RouteReuseStrategy,
        httpBatchLink: HttpBatchLink,
    ) {
        // On each page change, record in stats
        router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
            statisticService.recordPage();
        });

        dateAdapter.setLocale('fr-ch');

        const link = createApolloLink(
            networkActivityService,
            alertService,
            httpBatchLink,
            routeReuse as AppRouteReuseStrategy,
        );

        apollo.create({
            link: link,
            cache: new InMemoryCache(),
            defaultOptions: apolloDefaultOptions,
        });
    }
}
