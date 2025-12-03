import {Injectable} from '@angular/core';

export type ProgressBar = {
    startManual(): void;
    set(value: number): void;
    completeManual(): void;
};

/**
 * Service to access the progress bar for manual control.
 */
@Injectable({
    providedIn: 'root',
})
export class ProgressService {
    private progressBar: ProgressBar | null = null;

    public setProgressBar(bar: ProgressBar): void {
        this.progressBar = bar;
    }

    public startManual(): void {
        this.progressBar?.startManual();
    }

    public set(value: number): void {
        this.progressBar?.set(value);
    }

    public completeManual(): void {
        this.progressBar?.completeManual();
    }
}
