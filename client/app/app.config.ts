import {ApplicationConfig, ErrorHandler, inject, InjectionToken, provideAppInitializer} from '@angular/core';
import {Site} from './shared/generated-types';
import {quillConfig} from './shared/config/quill.options';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {routes} from './app.routes';
import {Apollo} from 'apollo-angular';
import {Literal, naturalProviders, provideIcons} from '@ecodev/natural';
import {provideHttpClient, withInterceptors, withJsonpSupport} from '@angular/common/http';
import {activityInterceptor} from './shared/interceptors/activity.interceptor';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {AppRouteReuseStrategy} from './app-route-reuse-strategy';
import {NavigationEnd, provideRouter, Router, RouteReuseStrategy, withRouterConfig} from '@angular/router';
import {bugsnagErrorHandlerFactory} from './shared/config/bugsnag';
import {MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorDefaultOptions, MatPaginatorIntl} from '@angular/material/paginator';
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
        provideIcons({}),
        {
            // See https://github.com/angular/components/issues/26580
            provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
            useValue: {
                formFieldAppearance: 'outline',
            } satisfies MatPaginatorDefaultOptions,
        },
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
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
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
    ],
};
