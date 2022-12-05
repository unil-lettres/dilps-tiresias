import Bugsnag from '@bugsnag/js';
import {environment} from '../../../environments/environment';
import {BugsnagErrorHandler} from '@bugsnag/plugin-angular';
import {ErrorHandler} from '@angular/core';

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
