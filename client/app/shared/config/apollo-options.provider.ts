import {
    ApolloClient,
    ApolloLink,
    CombinedGraphQLErrors,
    ErrorLike,
    InMemoryCache,
    InMemoryCacheConfig,
    type OperationVariables,
    ServerError,
} from '@apollo/client';
import {ErrorLink} from '@apollo/client/link/error';
import {AppRouteReuseStrategy} from '../../app-route-reuse-strategy';
import {createHttpLink, hasFilesAndProcessDate, NetworkActivityService} from '@ecodev/natural';
import {AlertService} from '../components/alert/alert.service';
import {HttpBatchLink, HttpLink} from 'apollo-angular/http';
import {inject, Provider} from '@angular/core';
import {RouteReuseStrategy} from '@angular/router';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {FormattedExecutionResult} from 'graphql';

export const apolloDefaultOptions: ApolloClient.Options['defaultOptions'] = {
    query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'none',
    },
    watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'none',
        returnPartialData: false,
        notifyOnNetworkStatusChange: false,
    },
    mutate: {
        errorPolicy: 'none',
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
 * Translate PHP configuration error messages to French
 *
 * Errors handled:
 * - upload_max_filesize
 * - post_max_size
 * - max_execution_time
 *
 * @param message The original error message
 * @returns Translated error message
 */
function translatePhpConfigurationError(message: string): string {
    if (message.includes('upload_max_filesize')) {
        return 'Le fichier dépasse la limite de taille autorisée.';
    }

    if (message.includes('post_max_size')) {
        return 'La taille totale des données envoyées dépasse la limite autorisée.';
    }

    if (message.includes('max_execution_time') || message.includes('Maximum execution time')) {
        return "L'opération a pris trop de temps à s'exécuter.";
    }

    return message;
}

/**
 * Create an Apollo link to show alert in case of error, and message if network is down
 */
function createErrorHandler(
    networkActivityService: NetworkActivityService,
    alertService: AlertService,
): ErrorLink.ErrorHandler {
    return options => {
        const error = serverErrorToUserFriendlyError(options.error, options.operation.variables);

        // Show GraphQL responses with errors to end-users
        if (CombinedGraphQLErrors.is(error)) {
            error.errors.forEach(error => {
                const translatedMessage = translatePhpConfigurationError(error.message);
                if ('extensions' in error && error.extensions?.showSnack) {
                    // Show whatever server prepared for end-user, with a bit more time to read
                    alertService.error(translatedMessage, 5000);
                } else {
                    // Use a generic message for internal error not to frighten end-user too much
                    alertService.error('Une erreur est survenue du côté du serveur');
                }

                networkActivityService.addErrors([{...error, message: translatedMessage}]);
            });
        } else {
            alertService.error('Une erreur est survenue sur le réseau');
        }
    };
}
/**
 *  Maybe transform the server error into a user visible, user friendly, error, but only if it is:
 *
 *  - an 413 error from `graphql-upload` about `post_max_size`
 *  - a 500 error about max_execution_time
 */
function serverErrorToUserFriendlyError(
    error: ErrorLike,
    variables: OperationVariables,
): ErrorLike | CombinedGraphQLErrors {
    if (!ServerError.is(error) || ![413, 500].includes(error.statusCode)) {
        return error;
    }

    if ([413, 500].includes(error.statusCode)) {
        let json: unknown;
        try {
            json = JSON.parse(error.bodyText) as unknown;
        } catch (e) {
            return error;
        }

        if (
            json &&
            typeof json === 'object' &&
            'message' in json &&
            Object.keys(json).length === 1 &&
            typeof json.message === 'string'
        ) {
            return combinedGraphQLErrors(json.message);
        }
    } else if (error.statusCode === 502 && hasFilesAndProcessDate(variables)) {
        // Trying our best to rescue a total crash of PHP because of a total crash of ImageMagick
        const message = `L'image n'a pas pu être traitée par le serveur. Essayez de convertir l'image dans un autre format.`;
        return combinedGraphQLErrors(message);
    }

    return error;
}

function combinedGraphQLErrors(message: string): CombinedGraphQLErrors {
    return new CombinedGraphQLErrors(
        {
            data: undefined,
            extensions: undefined,
        } as Partial<FormattedExecutionResult>,
        [
            {
                message: message,
                extensions: {showSnack: true},
            },
        ],
    );
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

        if (resetReuseOperations.includes(operation.operationName ?? '')) {
            routeReuseStrategy.clearDetachedRoutes();
        }

        return forward(operation);
    });

    // const errorLink = createErrorLink(networkActivityService, alertService);
    const errorLink = new ErrorLink(createErrorHandler(networkActivityService, alertService));

    return routeReuseClearer.concat(
        errorLink.concat(
            createHttpLink(httpLink, httpBatchLink, {
                uri: '/graphql',
            }),
        ),
    );
}

function apolloOptionsFactory(): ApolloClient.Options {
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
