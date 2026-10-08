import {InjectionToken} from '@angular/core';
import {type Site} from '../generated-types';

/**
 * The current site, Dilps or Tiresias, as served by the server
 *
 * It is declared apart from `app.config.ts`, otherwise every service injecting it would import all the routes, and
 * thus import itself, which breaks the services imported by unit tests.
 */
export const SITE = new InjectionToken<Site>('Current site');
