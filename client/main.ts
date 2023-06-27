import {APP_INITIALIZER, enableProdMode, ErrorHandler, importProvidersFrom, inject} from '@angular/core';
import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {quillConfig} from './app/shared/config/quill.options';
import {QuillModule} from 'ngx-quill';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {provideAnimations, provideNoopAnimations} from '@angular/platform-browser/animations';
import {routes} from './app/app-routing.module';
import {bootstrapApplication} from '@angular/platform-browser';
import {Apollo} from 'apollo-angular';
import {NetworkInterceptorService} from './app/shared/services/network-interceptor.service';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withJsonpSupport} from '@angular/common/http';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {AppRouteReuseStrategy} from './app/app-route-reuse-strategy';
import {NavigationEnd, provideRouter, Router, RouteReuseStrategy, withRouterConfig} from '@angular/router';
import {bugsnagErrorHandlerFactory} from './app/shared/config/bugsnag';
import {SITE} from './app/app.config';
import {MAT_PAGINATOR_DEFAULT_OPTIONS} from '@angular/material/paginator';
import {IScrollbarOptions, NG_SCROLLBAR_OPTIONS} from 'ngx-scrollbar';
import {Literal, naturalProviders, provideIcons} from '@ecodev/natural';
import {apolloDefaultOptions, createApolloLink} from './app/shared/config/apollo.link.creator';
import {filter} from 'rxjs/operators';
import {InMemoryCache} from '@apollo/client/core';
import {NetworkActivityService} from './app/shared/services/network-activity.service';
import {AlertService} from './app/shared/components/alert/alert.service';
import {StatisticService} from './app/statistics/services/statistic.service';
import {HttpBatchLink} from 'apollo-angular/http';

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
    typeof document === 'undefined' ||
    !('animate' in document.documentElement) ||
    (navigator && /iPhone OS (8|9|10|11|12|13)_/.test(navigator.userAgent));

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(MatNativeDateModule, QuillModule.forRoot(quillConfig)),
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
            },
        },
        {provide: SITE, useValue: (window as Literal)['APP_SITE']},
        {provide: ErrorHandler, useFactory: bugsnagErrorHandlerFactory},
        {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy},
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: matTooltipCustomConfig},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NetworkInterceptorService,
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
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
                const apollo = inject(Apollo);
                const networkActivityService = inject(NetworkActivityService);
                const alertService = inject(AlertService);
                const dateAdapter = inject(DateAdapter<Date>);
                const statisticService = inject(StatisticService);
                const router = inject(Router);
                const routeReuse = inject(RouteReuseStrategy);
                const httpBatchLink = inject(HttpBatchLink);

                return () => {
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
                };
            },
        },
    ],
}).catch(err => console.log(err));
