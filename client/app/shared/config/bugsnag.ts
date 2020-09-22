import Bugsnag from '@bugsnag/js';
import {environment} from '../../../environments/environment';
import {BugsnagErrorHandler} from '@bugsnag/plugin-angular';

/** Bugsnag client configuration */
const bugsnagClient = Bugsnag.start({
    apiKey: environment.bugsnagApiKey,
    releaseStage: environment.environment,
    enabledReleaseStages: ['production', 'staging'],
});

/** Factory which will return the Bugsnag error handler */
export function bugsnagErrorHandlerFactory(): BugsnagErrorHandler {
    return new BugsnagErrorHandler(bugsnagClient);
}
