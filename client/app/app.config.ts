import {InjectionToken} from '@angular/core';
import {Site} from './shared/generated-types';

export const SITE = new InjectionToken<Site>('Current site');
