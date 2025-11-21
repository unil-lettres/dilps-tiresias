import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {NetworkActivityService} from '@ecodev/natural';
import {finalize} from 'rxjs';

/**
 * Check if the request body corresponds to a silent operation.
 *
 * @param body The request body
 * @returns True if the operation is silent, false otherwise
 */
function isSilentOperation(body: unknown): boolean {
    if (!body || typeof body !== 'object') {
        return false;
    }

    // GraphQL batch queries (array)
    if (Array.isArray(body)) {
        return body.every(item => isSilentOperation(item));
    }

    // Statistics queries should be silent
    const operationName = (body as {operationName?: string}).operationName;
    if (operationName && ['RecordPage', 'RecordDetail', 'RecordSearch'].includes(operationName)) {
        return true;
    }

    // Pagination request for the grid should be silent
    const variables = (body as {variables?: {pagination?: {offset?: number}}}).variables;
    if (variables?.pagination) {
        const {offset} = variables.pagination;
        if (offset !== undefined && offset !== null && offset !== 0) {
            return true;
        }
    }

    return false;
}

/**
 * Custom HTTP interceptor to track network activity and display the progress bar.
 *
 * Based on the @ecodev/natural activity interceptors.
 * https://github.com/Ecodev/natural/blob/eb581ce276173bb87f5ce846204ce80254a33964/projects/natural/src/lib/classes/network-activity.service.ts#L15
 */
export const activityInterceptor: HttpInterceptorFn = (req, next) => {
    const networkActivityService = inject(NetworkActivityService);

    const shouldIgnore = isSilentOperation(req.body);

    if (!shouldIgnore) {
        networkActivityService.increase();
    }

    return next(req).pipe(
        finalize(() => {
            if (!shouldIgnore) {
                networkActivityService.decrease();
            }
        }),
    );
};
