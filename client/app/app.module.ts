import {CdkAccordionModule} from '@angular/cdk/accordion';
import {Apollo, ApolloModule} from 'apollo-angular';
import {InMemoryCache} from '@apollo/client/core';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@ngbracket/ngx-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatSortModule} from '@angular/material/sort';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions, MatTooltipModule} from '@angular/material/tooltip';
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
import {TypeTextComponent} from './extended/type-text/type-text.component';
import {TypeNaturalSelectComponent} from './extended/type-natural-select/type-natural-select.component';
import {FilesComponent} from './files/files/files.component';
import {ErrorComponent} from './shared/components/error/error.component';
import {NetworkInterceptorService} from './shared/services/network-interceptor.service';
import {HttpBatchLink} from 'apollo-angular/http';
import {GoogleMapsModule} from '@angular/google-maps';
import {HideTooltipDirective} from './shared/directives/hide-tooltip.directive';
import {IScrollbarOptions, NG_SCROLLBAR_OPTIONS, NgScrollbarModule} from 'ngx-scrollbar';

const icons: NaturalIconsConfig = {};

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
        TypeTextComponent,
        TypeNaturalSelectComponent,
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
        NgScrollbarModule,
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
        CdkAccordionModule,
        GoogleMapsModule,
        NaturalDropdownComponentsModule,
        NaturalIconModule.forRoot(icons),
        NaturalRelationsModule,
        NaturalSelectModule,
        NaturalTableButtonModule,
        NaturalAlertModule,
        NaturalFixedButtonModule,
        NaturalHierarchicSelectorModule,
        HighchartsChartModule,
        MatSortModule,
        QuillModule.forRoot(quillConfig),
        NaturalCommonModule,
        NaturalFileModule,
    ],
    providers: [
        {
            provide: NG_SCROLLBAR_OPTIONS,
            useValue: {
                visibility: 'hover',
            } satisfies Partial<IScrollbarOptions>,
        },
        {
            // See https://github.com/angular/components/issues/26580
            provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
            useValue: {
                formFieldAppearance: 'fill',
            },
        },
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
