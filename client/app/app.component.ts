import {OverlayContainer} from '@angular/cdk/overlay';
import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {SITE} from './app.config';
import {Site} from './shared/generated-types';
import {ThemeService} from './shared/services/theme.service';
import {takeUntil} from 'rxjs/operators';
import {NaturalAbstractController} from '@ecodev/natural';
import {BootLoaderComponent} from './shared/components/boot-loader/boot-loader.component';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {NgProgressComponent} from 'ngx-progressbar';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [NgProgressComponent, RouterOutlet, CommonModule, BootLoaderComponent],
})
export class AppComponent extends NaturalAbstractController implements OnInit {
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

    public constructor(
        private readonly themeService: ThemeService,
        private readonly overlayContainer: OverlayContainer,
        private readonly matIconRegistry: MatIconRegistry,
        private readonly domSanitizer: DomSanitizer,
        @Inject(SITE) private readonly site: Site,
    ) {
        super();
        themeService.set(site + '-' + environment.environment);
        this.favIcon.href = site === Site.dilps ? 'favicon-dilps.ico' : 'favicon-tiresias.ico';

        // Register custom icons.
        [
            ['sort_asc', 'sort_asc.svg'],
            ['library_remove', 'library_remove.svg'],
            ['select_all_mark', 'select_all_mark.svg'],
        ].forEach(([name, path]) => {
            matIconRegistry.addSvgIcon(name, domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + path));
        });
    }

    public ngOnInit(): void {
        this.themeService.theme.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newTheme => {
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
