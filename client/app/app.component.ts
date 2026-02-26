import {OverlayContainer} from '@angular/cdk/overlay';
import {Component, effect, inject, OnInit, viewChild} from '@angular/core';
import {environment} from '../environments/environment';
import {SITE} from './app.config';
import {Site} from './shared/generated-types';
import {ThemeService} from './shared/services/theme.service';
import {BootLoaderComponent} from './shared/components/boot-loader/boot-loader.component';
import {RouterOutlet} from '@angular/router';
import {NgProgressbar, NgProgressRef} from 'ngx-progressbar';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NetworkActivityService} from '@ecodev/natural';
import {ProgressService} from './shared/services/progress.service';

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
    host: {
        '[class]': 'theme',
    },
})
export class AppComponent implements OnInit {
    private readonly networkActivityService = inject(NetworkActivityService);
    private readonly progressService = inject(ProgressService);
    private readonly ngProgressRef = viewChild.required(NgProgressRef);
    private readonly themeService = inject(ThemeService);
    private readonly overlayContainer = inject(OverlayContainer);
    private readonly matIconRegistry = inject(MatIconRegistry);
    private readonly domSanitizer = inject(DomSanitizer);
    private readonly site = inject(SITE);

    /**
     * Bind theme at root-app level
     */
    protected theme = '';

    /**
     * When first route is loaded, hide the app-bootloader component
     */
    protected initialized = false;

    private lastTheme = '';

    private favIcon: HTMLLinkElement = document.querySelector('#favIcon')!;

    private readonly themeService$ = this.themeService.theme.pipe(takeUntilDestroyed());

    public constructor() {
        effect(() => {
            const progressRef = this.ngProgressRef();
            const delayedProgressBar = new DelayedProgressBar(progressRef);
            this.progressService.setProgressBar(delayedProgressBar);
            this.networkActivityService.setProgressRef(delayedProgressBar);
        });

        const themeService = this.themeService;
        const matIconRegistry = this.matIconRegistry;
        const domSanitizer = this.domSanitizer;
        const site = this.site;

        themeService.init(site, environment.environment);
        this.favIcon.href = site === Site.Dilps ? 'favicon-dilps.svg' : 'favicon-tiresias.svg';

        // Register custom icons.
        [
            ['sort_asc', 'sort_asc.svg'],
            ['library_remove', 'library_remove.svg'],
            ['select_all_mark', 'select_all_mark.svg'],
            ['cards_game', 'cards_game.svg'],
        ].forEach(([name, path]) => {
            matIconRegistry.addSvgIcon(name, domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + path));
        });
    }

    public ngOnInit(): void {
        this.themeService$.subscribe(newTheme => {
            if (this.lastTheme) {
                document.body.classList.remove(this.lastTheme);
            }

            // Remove old theme class from overlay (dialogs, snackbars, etc...)
            this.themeService.themes.forEach(theme => {
                this.overlayContainer.getContainerElement().classList.remove(theme);
                this.overlayContainer.getContainerElement().classList.remove(theme + '-dark');
            });

            // set new theme class
            this.overlayContainer.getContainerElement().classList.add(newTheme);
            this.theme = newTheme;
            this.lastTheme = newTheme;
            document.body.classList.add(newTheme);
        });
    }
}
