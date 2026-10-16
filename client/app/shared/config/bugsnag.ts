import Bugsnag from '@bugsnag/js';
import {environment} from '../../../environments/environment';
import {BugsnagErrorHandler} from '@bugsnag/plugin-angular';
import {ErrorHandler} from '@angular/core';
import {type ErrorLike, ServerError} from '@apollo/client';

/** Factory which will return the Bugsnag error handler */
export function bugsnagErrorHandlerFactory(): ErrorHandler {
    const apiKey = environment.bugsnagApiKey;
    if (apiKey) {
        // Bugsnag client configuration
        const bugsnagClient = Bugsnag.start({
            apiKey: apiKey,
            releaseStage: environment.environment,
            enabledReleaseStages: ['production', 'staging'],
        });

        return new BugsnagErrorHandler(bugsnagClient);
    }

    return new ErrorHandler();
}

/**
 * Tell the next report which GraphQL operation failed, and what the server answered, because the error reported
 * itself does not say it
 */
export function leaveGraphQLErrorBreadcrumb(operationName: string | undefined, error: ErrorLike): void {
    if (!Bugsnag.isStarted()) {
        return;
    }

    const metadata: Record<string, string | number> = {error: error.message};
    if (ServerError.is(error)) {
        metadata.status = error.statusCode;
        metadata.body = error.bodyText.slice(0, 1000);
    }

    Bugsnag.leaveBreadcrumb(`GraphQL ${operationName ?? 'anonymous'} failed`, metadata, 'request');
}
