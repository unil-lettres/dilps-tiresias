import {inject, type Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs/operators';
import {UserService} from '../../users/services/user.service';
import {type ViewerQuery} from '../generated-types';

export type GlobalPermission = Exclude<keyof NonNullable<ViewerQuery['viewer']>['globalPermissions'], '__typename'>;

/**
 * Whether the viewer can create objects of the given type, so that we offer to create only what the server accepts
 *
 * Must be called in an injection context.
 */
export function viewerCanCreate(permission: GlobalPermission): Signal<boolean> {
    const user$ = inject(UserService).getCurrentUser();

    return toSignal(user$.pipe(map(user => !!user?.globalPermissions[permission]?.create)), {initialValue: false});
}
