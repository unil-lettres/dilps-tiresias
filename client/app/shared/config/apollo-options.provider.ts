import {
    ApolloClientOptions,
    ApolloLink,
    DefaultOptions,
    InMemoryCache,
    InMemoryCacheConfig,
    NormalizedCacheObject,
} from '@apollo/client/core';
import {onError} from '@apollo/client/link/error';
import {AppRouteReuseStrategy} from '../../app-route-reuse-strategy';
import {createHttpLink, hasFilesAndProcessDate, NetworkActivityService} from '@ecodev/natural';
import {AlertService} from '../components/alert/alert.service';
import {HttpBatchLink, HttpLink} from 'apollo-angular/http';
import {inject, Provider} from '@angular/core';
import {RouteReuseStrategy} from '@angular/router';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpErrorResponse} from '@angular/common/http';

export const apolloDefaultOptions: DefaultOptions = {
    query: {
        fetchPolicy: 'network-only',
    },
    watchQuery: {
        fetchPolicy: 'cache-and-network',
    },
};

export const cacheConfig: InMemoryCacheConfig = {
    typePolicies: {
        Card: {
            fields: {
                collections: {
                    // Because we always receive **all** collections at once, we
                    // can always replace everything that exists, even if the incoming
                    // has less collection than existing (because collections were deleted)
                    merge: (existing, incoming) => incoming,
                },
            },
        },
        Permissions: {
            // Incoming permissions always overwrite whatever permission might already exist
            merge: true,
        },
    },
};

/**
 * Create an Apollo link to show alert in case of error, and message if network is down
 */
function createErrorLink(networkActivityService: NetworkActivityService, alertService: AlertService): ApolloLink {
    return onError(errorResponse => {
        // Network errors are not caught by uploadInterceptor, so we need to decrease pending queries
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        const networkError = errorResponse.networkError;
        if (networkError) {
            networkActivityService.decrease();

            // Show the error message if is:
            // - an 413 error from `graphql-upload` about `post_max_size`
            // - a 500 error about max_execution_time
            if (
                networkError instanceof HttpErrorResponse &&
                [413, 500].includes(networkError.status) &&
                typeof networkError.error?.message === 'string'
            ) {
                alertService.error(networkError.error.message, 5000);
                networkActivityService.addErrors([networkError.error]);
            } else if (
                networkError instanceof HttpErrorResponse &&
                networkError.status === 502 &&
                hasFilesAndProcessDate(errorResponse.operation.variables)
            ) {
                // Trying our best to rescue a total crash of PHP because of a total crash of ImageMagick
                const message = `Il est possible que l'image uploadée ait entrainé une erreur sur le serveur. Modifiez l'image avant de l'uploader ou transmettez la par email à un responsable.`;
                alertService.error(message, 5000);
                networkActivityService.addErrors([{message: message}]);
            } else {
                alertService.error('Une erreur est survenue sur le réseau');
            }
        }

        // Show Graphql responses with errors to end-users (but do not decrease pending queries because it is done by uploadInterceptor)
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        if (errorResponse.graphQLErrors) {
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            errorResponse.graphQLErrors.forEach(error => {
                if ('extensions' in error && error.extensions?.showSnack) {
                    // Show whatever server prepared for end-user, with a bit more time to read
                    alertService.error(error.message, 5000);
                } else {
                    // Use a generic message for internal error not to frighten end-user too much
                    alertService.error('Une erreur est survenue du côté du serveur');
                }
            });

            // eslint-disable-next-line @typescript-eslint/no-deprecated
            networkActivityService.addErrors(errorResponse.graphQLErrors);
        }
    });
}

function createApolloLink(
    networkActivityService: NetworkActivityService,
    alertService: AlertService,
    httpLink: HttpLink,
    httpBatchLink: HttpBatchLink,
    routeReuseStrategy: AppRouteReuseStrategy,
): ApolloLink {
    const routeReuseClearer = new ApolloLink((operation, forward) => {
        const resetReuseOperations = ['CreateCard', 'CreateCollection', 'UpdateCollection', 'DeleteCollections'];

        if (resetReuseOperations.includes(operation.operationName)) {
            routeReuseStrategy.clearDetachedRoutes();
        }

        return forward(operation);
    });

    const errorLink = createErrorLink(networkActivityService, alertService);

    return routeReuseClearer.concat(
        errorLink.concat(
            createHttpLink(httpLink, httpBatchLink, {
                uri: '/graphql',
            }),
        ),
    );
}

function apolloOptionsFactory(): ApolloClientOptions<NormalizedCacheObject> {
    const networkActivityService = inject(NetworkActivityService);
    const alertService = inject(AlertService);
    const httpLink = inject(HttpLink);
    const httpBatchLink = inject(HttpBatchLink);
    const routeReuse = inject(RouteReuseStrategy) as AppRouteReuseStrategy;

    const link = createApolloLink(networkActivityService, alertService, httpLink, httpBatchLink, routeReuse);

    return {
        link: link,
        cache: new InMemoryCache(cacheConfig),
        defaultOptions: apolloDefaultOptions,
    };
}

export const apolloOptionsProvider: Provider = {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory,
};
