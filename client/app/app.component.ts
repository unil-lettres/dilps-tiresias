import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';

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

    constructor(private themeSvc: ThemeService, private overlayContainer: OverlayContainer) {
    }

    public ngOnInit() {

        this.themeSvc.theme.subscribe(newTheme => {

            // Remove old theme class from overlay (dialogs, snackbars, etc...)
            this.themeSvc.themes.forEach(them => {
                this.overlayContainer.getContainerElement().classList.remove(them);
                this.overlayContainer.getContainerElement().classList.remove(them + 'Dark');
            });

            // set new theme class
            this.overlayContainer.getContainerElement().classList.add(newTheme);
            this.theme = newTheme;
        });

    }
}
