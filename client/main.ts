import {ErrorHandler, inject, provideAppInitializer} from '@angular/core';
import {AppComponent} from './app/app.component';
import {quillConfig} from './app/shared/config/quill.options';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {routes} from './app/app-routing.module';
import {bootstrapApplication} from '@angular/platform-browser';
import {Apollo} from 'apollo-angular';
import {activityInterceptor, Literal, naturalProviders, provideIcons} from '@ecodev/natural';
import {provideHttpClient, withInterceptors, withJsonpSupport} from '@angular/common/http';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {AppRouteReuseStrategy} from './app/app-route-reuse-strategy';
import {NavigationEnd, provideRouter, Router, RouteReuseStrategy, withRouterConfig} from '@angular/router';
import {bugsnagErrorHandlerFactory} from './app/shared/config/bugsnag';
import {SITE} from './app/app.config';
import {MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorDefaultOptions, MatPaginatorIntl} from '@angular/material/paginator';
import {apolloOptionsProvider} from './app/shared/config/apollo-options.provider';
import {filter} from 'rxjs/operators';
import {StatisticService} from './app/statistics/services/statistic.service';
import {MAT_TABS_CONFIG, MatTabsConfig} from '@angular/material/tabs';
import {provideQuillConfig} from 'ngx-quill';
import {provideScrollbarOptions} from 'ngx-scrollbar';
import {CustomPaginatorIntl} from './app/shared/services/custom-paginator-intl.service';
import {provideHighcharts} from 'highcharts-angular';

const matTooltipCustomConfig: MatTooltipDefaultOptions = {
    showDelay: 5,
    hideDelay: 5,
    touchendHideDelay: 5,
    touchGestures: 'off',
};

// Disable animations if not supported (on iPhone 6 / Safari 13, or SSR)
const disableAnimations =
    typeof document === 'undefined' ||
    !('animate' in document.documentElement) ||
    (navigator && /iPhone OS (8|9|10|11|12|13)_/.test(navigator.userAgent));

const prefersReducedMotion = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion)').matches : false;

bootstrapApplication(AppComponent, {
    providers: [
        provideQuillConfig(quillConfig),
        provideNativeDateAdapter(),
        Apollo,
        provideAnimationsAsync(disableAnimations || prefersReducedMotion ? 'noop' : 'animations'),
        naturalProviders,
        provideIcons({}),
        {
            // See https://github.com/angular/components/issues/26580
            provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
            useValue: {
                formFieldAppearance: 'fill',
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
}).catch((err: unknown) => {
    console.error(err);
});
