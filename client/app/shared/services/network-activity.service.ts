import {inject, Injectable} from '@angular/core';
import {NgProgress} from 'ngx-progressbar';
import {BehaviorSubject, Subject} from 'rxjs';
import {GraphQLFormattedError} from 'graphql';

@Injectable({
    providedIn: 'root',
})
export class NetworkActivityService {
    private readonly progressService = inject(NgProgress);

    /**
     * Count pending requests
     */
    public pending = 0;

    /**
     * Observable specifying if app is loading or not
     */
    public readonly isPending = new BehaviorSubject<boolean>(false);
    public readonly errors = new Subject<readonly GraphQLFormattedError[]>();

    public increase(): void {
        if (this.pending === 0) {
            this.progressService.ref().start();
        }

        this.pending++;
        this.isPending.next(this.pending > 0);
    }

    public decrease(): void {
        this.pending--;
        this.isPending.next(this.pending > 0);

        // Mark progress a completed, after waiting 20ms in case a refetchQueries would be used
        if (this.pending === 0) {
            setTimeout(() => {
                if (this.pending === 0) {
                    this.progressService.ref().complete();
                }
            }, 20);
        }
    }

    public updateErrors(errors: readonly GraphQLFormattedError[]): void {
        if (errors?.length) {
            this.errors.next(errors);
        }
    }
}
