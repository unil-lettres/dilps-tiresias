import {OverlayContainer} from '@angular/cdk/overlay';
import {Component, HostBinding, inject, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {SITE} from './app.config';
import {Site} from './shared/generated-types';
import {ThemeService} from './shared/services/theme.service';
import {BootLoaderComponent} from './shared/components/boot-loader/boot-loader.component';
import {RouterOutlet} from '@angular/router';
import {NgProgressComponent} from 'ngx-progressbar';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
    imports: [NgProgressComponent, RouterOutlet, BootLoaderComponent],
})
export class AppComponent implements OnInit {
    private readonly themeService = inject(ThemeService);
    private readonly overlayContainer = inject(OverlayContainer);
    private readonly matIconRegistry = inject(MatIconRegistry);
    private readonly domSanitizer = inject(DomSanitizer);
    private readonly site = inject(SITE);

    /**
     * Bind theme at root-app level
     */
    @HostBinding('class') public theme = '';

    /**
     * When first route is loaded, hide the app-bootloader component
     */
    public initialized = false;

    private lastTheme = '';

    private favIcon: HTMLLinkElement = document.querySelector('#favIcon')!;

    private readonly themeService$ = this.themeService.theme.pipe(takeUntilDestroyed());

    public constructor() {
        const themeService = this.themeService;
        const matIconRegistry = this.matIconRegistry;
        const domSanitizer = this.domSanitizer;
        const site = this.site;

        themeService.set(site + '-' + environment.environment);
        this.favIcon.href = site === Site.dilps ? 'favicon-dilps.ico' : 'favicon-tiresias.ico';

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
