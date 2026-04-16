import {ApplicationConfig, ErrorHandler, inject, InjectionToken, provideAppInitializer} from '@angular/core';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {Site} from './shared/generated-types';
import {quillConfig} from './shared/config/quill.options';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {routes} from './app.routes';
import {Apollo} from 'apollo-angular';
import {Literal, naturalProviders, provideIcons, provideThemes} from '@ecodev/natural';
import {provideHttpClient, withInterceptors, withJsonpSupport} from '@angular/common/http';
import {activityInterceptor} from './shared/interceptors/activity.interceptor';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {AppRouteReuseStrategy} from './app-route-reuse-strategy';
import {NavigationEnd, provideRouter, Router, RouteReuseStrategy, withRouterConfig} from '@angular/router';
import {bugsnagErrorHandlerFactory} from './shared/config/bugsnag';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {apolloOptionsProvider} from './shared/config/apollo-options.provider';
import {filter} from 'rxjs/operators';
import {StatisticService} from './statistics/services/statistic.service';
import {MAT_TABS_CONFIG, MatTabsConfig} from '@angular/material/tabs';
import {provideQuillConfig} from 'ngx-quill';
import {provideScrollbarOptions} from 'ngx-scrollbar';
import {CustomPaginatorIntl} from './shared/services/custom-paginator-intl.service';
import {provideHighcharts} from 'highcharts-angular';

export const SITE = new InjectionToken<Site>('Current site');

const matTooltipCustomConfig: MatTooltipDefaultOptions = {
    showDelay: 5,
    hideDelay: 5,
    touchendHideDelay: 5,
    touchGestures: 'off',
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideQuillConfig(quillConfig),
        provideNativeDateAdapter(),
        Apollo,
        naturalProviders,
        provideIcons({
            sort_asc: {
                svg: 'assets/icons/sort_asc.svg',
            },
            library_remove: {
                svg: 'assets/icons/library_remove.svg',
            },
            select_all_mark: {
                svg: 'assets/icons/select_all_mark.svg',
            },
            cards_game: {
                svg: 'assets/icons/cards_game.svg',
            },
        }),
        {
            provide: MAT_TABS_CONFIG,
            useValue: {
                stretchTabs: false,
            } satisfies MatTabsConfig,
        },
        {provide: SITE, useValue: (window as Literal).APP_SITE},
        {provide: ErrorHandler, useFactory: bugsnagErrorHandlerFactory},
        {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy},
        apolloOptionsProvider,
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: matTooltipCustomConfig},
        provideHttpClient(withInterceptors([activityInterceptor]), withJsonpSupport()),
        provideRouter(
            routes,
            withRouterConfig({
                paramsInheritanceStrategy: 'emptyOnly',
            }),
        ),
        provideAppInitializer(() => {
            const dateAdapter = inject(DateAdapter<Date>);
            const statisticService = inject(StatisticService);
            const router = inject(Router);

            // On each page change, record in stats
            router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
                statisticService.recordPage();
            });

            dateAdapter.setLocale('fr-ch');
        }),
        provideScrollbarOptions({
            visibility: 'hover',
            appearance: 'compact',
        }),
        {provide: MatPaginatorIntl, useClass: CustomPaginatorIntl},
        provideHighcharts(),

        // Sorting is importance because of scss files optimization (removed inherited tokens)
        provideThemes([
            'dilps-production',
            'dilps-staging',
            'dilps-development',
            'tiresias-production',
            'tiresias-staging',
            'tiresias-development',
        ]),
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {maxWidth: '800px'}},
    ],
};
