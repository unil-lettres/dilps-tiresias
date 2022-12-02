import {OverlayContainer} from '@angular/cdk/overlay';
import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {SITE} from './app.config';
import {Site} from './shared/generated-types';
import {ThemeService} from './shared/services/theme.service';
import {takeUntil} from 'rxjs/operators';
import {NaturalAbstractController} from '@ecodev/natural';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent extends NaturalAbstractController implements OnInit {
    /**
     * Bind theme at root-app level
     */
    @HostBinding('class') public theme = '';

    /**
     * When first route is loaded, hide the app-bootloader component
     */
    public initialized: boolean;

    private lastTheme = '';

    private favIcon: HTMLLinkElement = document.querySelector('#favIcon');

    public constructor(
        private readonly themeService: ThemeService,
        private readonly overlayContainer: OverlayContainer,
        @Inject(SITE) private readonly site: Site,
    ) {
        super();
        themeService.set(site + '-' + environment.environment);
        this.favIcon.href = site === Site.dilps ? 'favicon-dilps.ico' : 'favicon-tiresias.ico';
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
