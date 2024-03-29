import {APP_INITIALIZER, enableProdMode, ErrorHandler, importProvidersFrom, inject} from '@angular/core';
import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {quillConfig} from './app/shared/config/quill.options';
import {QuillModule} from 'ngx-quill';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {provideAnimations, provideNoopAnimations} from '@angular/platform-browser/animations';
import {routes} from './app/app-routing.module';
import {bootstrapApplication} from '@angular/platform-browser';
import {Apollo} from 'apollo-angular';
import {activityInterceptor} from './app/shared/services/activity-interceptor';
import {provideHttpClient, withInterceptors, withJsonpSupport} from '@angular/common/http';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {AppRouteReuseStrategy} from './app/app-route-reuse-strategy';
import {NavigationEnd, provideRouter, Router, RouteReuseStrategy, withRouterConfig} from '@angular/router';
import {bugsnagErrorHandlerFactory} from './app/shared/config/bugsnag';
import {SITE} from './app/app.config';
import {MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorDefaultOptions} from '@angular/material/paginator';
import {IScrollbarOptions, NG_SCROLLBAR_OPTIONS} from 'ngx-scrollbar';
import {Literal, naturalProviders, provideIcons} from '@ecodev/natural';
import {apolloOptionsProvider} from './app/shared/config/apollo.link.creator';
import {filter} from 'rxjs/operators';
import {StatisticService} from './app/statistics/services/statistic.service';
import {MAT_TABS_CONFIG, MatTabsConfig} from '@angular/material/tabs';

if (environment.environment === 'production' || environment.environment === 'staging') {
    enableProdMode();
}

const matTooltipCustomConfig: MatTooltipDefaultOptions = {
    showDelay: 5,
    hideDelay: 5,
    touchendHideDelay: 5,
    touchGestures: 'off',
};

// Disable animations if not supported (on iPhone 6 / Safari 13, or SSR)
const disableAnimations =
    // eslint-disable-next-line no-restricted-globals
    typeof document === 'undefined' ||
    // eslint-disable-next-line no-restricted-globals
    !('animate' in document.documentElement) ||
    // eslint-disable-next-line no-restricted-globals
    (navigator && /iPhone OS (8|9|10|11|12|13)_/.test(navigator.userAgent));

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(QuillModule.forRoot(quillConfig)),
        provideNativeDateAdapter(),
        Apollo,
        disableAnimations ? provideNoopAnimations() : provideAnimations(),
        naturalProviders,
        provideIcons({}),
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

        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: (): (() => void) => {
                const dateAdapter = inject(DateAdapter<Date>);
                const statisticService = inject(StatisticService);
                const router = inject(Router);

                return () => {
                    // On each page change, record in stats
                    router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
                        statisticService.recordPage();
                    });

                    dateAdapter.setLocale('fr-ch');
                };
            },
        },
    ],
}).catch(err => console.log(err));
