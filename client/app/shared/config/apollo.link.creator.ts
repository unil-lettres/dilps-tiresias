import {ApolloLink, DefaultOptions} from '@apollo/client/core';
import {onError} from '@apollo/client/link/error';
import {AppRouteReuseStrategy} from '../../app-route-reuse-strategy';
import {NetworkActivityService} from '../services/network-activity.service';
import {createUploadLink} from 'apollo-upload-client';
import {AlertService} from '../components/alert/alert.service';
import {hasFilesAndProcessDate} from '@ecodev/natural';
import {HttpBatchLink} from 'apollo-angular/http';

export const apolloDefaultOptions: DefaultOptions = {
    query: {
        fetchPolicy: 'network-only',
    },
    watchQuery: {
        fetchPolicy: 'cache-and-network',
    },
};

/**
 * Create an Apollo link to show alert in case of error, and message if network is down
 */
function createErrorLink(networkActivityService: NetworkActivityService, alertService: AlertService): ApolloLink {
    return onError(errorResponse => {
        // Network errors are not caught by uploadInterceptor, so we need to decrease pending queries
        if (errorResponse.networkError) {
            alertService.error('Une erreur est survenue sur le réseau');
            networkActivityService.decrease();
        }

        // Show Graphql responses with errors to end-users (but do not decrease pending queries because it is done by uploadInterceptor)
        if (errorResponse.graphQLErrors) {
            errorResponse.graphQLErrors.forEach(error => {
                // Use generic message for internal error not to frighten end-user too much
                if (error.extensions && error.extensions.category === 'internal') {
                    alertService.error('Une erreur est survenue du côté du serveur');
                } else {
                    // Show whatever server prepared for end-user, with a little bit more time to read
                    alertService.error(error.message, 5000);
                }
            });

            networkActivityService.updateErrors(errorResponse.graphQLErrors);
        }
    });
}

export function createApolloLink(
    networkActivityService: NetworkActivityService,
    alertService: AlertService,
    httpBatchLink: HttpBatchLink,
    routeReuseStrategy: AppRouteReuseStrategy,
): ApolloLink {
    const options = {
        uri: '/graphql',
        credentials: 'include',
    };

    const routeReuseClearer = new ApolloLink((operation, forward) => {
        const resetReuseOperations = [
            'CreateCard',
            'UpdateCard',
            'CreateCollection',
            'UpdateCollection',
            'DeleteCollections',
        ];

        if (resetReuseOperations.includes(operation.operationName)) {
            routeReuseStrategy.clearHandlers();
        }

        return forward(operation);
    });

    const uploadInterceptor = new ApolloLink((operation, forward) => {
        networkActivityService.increase();

        return forward(operation).map(response => {
            networkActivityService.decrease();
            return response;
        });
    });

    // If query has no file, batch it, otherwise upload only that query
    const httpLink = ApolloLink.split(
        operation => hasFilesAndProcessDate(operation.variables),
        uploadInterceptor.concat(createUploadLink(options)),
        httpBatchLink.create(options),
    );

    const errorLink = createErrorLink(networkActivityService, alertService);

    return routeReuseClearer.concat(errorLink.concat(httpLink));
}
