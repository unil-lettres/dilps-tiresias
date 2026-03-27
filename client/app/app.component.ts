import {Component, effect, inject, viewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NetworkActivityService} from '@ecodev/natural';
import {NgProgressbar, NgProgressRef} from 'ngx-progressbar';
import {environment} from '../environments/environment';
import {SITE} from './app.config';
import {BootLoaderComponent} from './shared/components/boot-loader/boot-loader.component';
import {Site} from './shared/generated-types';
import {ProgressService} from './shared/services/progress.service';
import {ThemeService} from './shared/services/theme.service';

class DelayedProgressBar {
    private isVisible = false;
    private isManualMode = false;
    private progressTimeout: ReturnType<typeof setTimeout> | null = null;
    private hideTimeout: ReturnType<typeof setTimeout> | null = null;

    public constructor(private progressRef: NgProgressRef) {}

    public start(): void {
        // If in manual mode, network activity should not interfere
        if (this.isManualMode) {
            return;
        }

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        if (this.isVisible) {
            return;
        }

        if (this.progressTimeout) {
            clearTimeout(this.progressTimeout);
        }

        this.progressTimeout = setTimeout(() => {
            // Check again in case manual mode was activated during timeout
            if (!this.isManualMode) {
                this.isVisible = true;
                this.progressRef?.start();
            }
            this.progressTimeout = null;
        }, 600);
    }

    public complete(): void {
        // If in manual mode, network activity should not interfere
        if (this.isManualMode) {
            return;
        }

        if (this.progressTimeout) {
            clearTimeout(this.progressTimeout);
            this.progressTimeout = null;
        }

        if (!this.isVisible) {
            return;
        }

        this.hideTimeout = setTimeout(() => {
            this.isVisible = false;
            this.progressRef?.complete();
            this.hideTimeout = null;
        }, 300);
    }

    public startManual(): void {
        this.isManualMode = true;

        if (this.progressTimeout) {
            clearTimeout(this.progressTimeout);
            this.progressTimeout = null;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        this.isVisible = true;
        this.progressRef?.set(1);
    }

    public set(value: number): void {
        this.progressRef?.set(value);
    }

    public completeManual(): void {
        this.isManualMode = false;
        this.isVisible = false;
        this.progressRef?.complete();
    }
}

@Component({
    selector: 'app-root',
    imports: [NgProgressbar, RouterOutlet, BootLoaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    private readonly networkActivityService = inject(NetworkActivityService);
    private readonly progressService = inject(ProgressService);
    private readonly ngProgressRef = viewChild.required(NgProgressRef);
    private readonly themeService = inject(ThemeService);
    private readonly site = inject(SITE);

    /**
     * When first route is loaded, hide the app-bootloader component
     */
    protected initialized = false;

    private favIcon: HTMLLinkElement = document.querySelector('#favIcon')!;

    public constructor() {
        effect(() => {
            const progressRef = this.ngProgressRef();
            const delayedProgressBar = new DelayedProgressBar(progressRef);
            this.progressService.setProgressBar(delayedProgressBar);
            this.networkActivityService.setProgressRef(delayedProgressBar);
        });

        console.log(' environment.environment', environment.environment);
        this.themeService.setVariant(this.site, environment.environment);
        this.favIcon.href = this.site === Site.Dilps ? 'favicon-dilps.svg' : 'favicon-tiresias.svg';
    }
}
