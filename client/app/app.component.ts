import {OverlayContainer} from '@angular/cdk/overlay';
import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {SITE} from './app.config';
import {Site} from './shared/generated-types';
import {ThemeService} from './shared/services/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    /**
     * Bind theme at root-app level
     */
    @HostBinding('class') public theme = '';

    /**
     * When first route is loaded, hide the app-bootloader component
     */
    public initialized: boolean;

    private lastTheme;

    constructor(
        private themeService: ThemeService,
        private overlayContainer: OverlayContainer,
        @Inject(SITE) private site: Site,
    ) {
        themeService.set(site + '-' + environment.environment);
    }

    public ngOnInit() {
        this.themeService.theme.subscribe(newTheme => {
            document.body.classList.remove(this.lastTheme);

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
