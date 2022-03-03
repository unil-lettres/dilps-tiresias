import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SITE} from '../../app.config';
import {Site} from '../generated-types';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    public readonly themes = [
        'dilps-production',
        'dilps-staging',
        'dilps-development',
        'tiresias-production',
        'tiresias-staging',
        'tiresias-development',
    ];

    public readonly theme: BehaviorSubject<string> = new BehaviorSubject(this.themes[0]);
    private darkActivated = false;

    private storageKey = '';

    public constructor(@Inject(SITE) site: Site) {
        this.storageKey = site + '-theme';

        const theme = localStorage.getItem(this.storageKey);

        this.theme.next(theme);
        if (theme && theme.indexOf('-dark') > -1) {
            this.darkActivated = true;
        }
    }

    public set(theme: string): void {
        // Set default theme if stored theme don't exist
        if (!theme || (theme && this.themes.indexOf(theme.replace('-dark', '')) < 0)) {
            this.set(this.themes[0]);
            return;
        }

        if (this.darkActivated && theme.indexOf('-dark') === -1) {
            theme += '-dark';
        } else {
            theme = theme.replace('-dark', '');
        }

        localStorage.setItem(this.storageKey, theme);
        this.theme.next(theme);
    }

    public toggleNightMode(): void {
        this.darkActivated = !this.darkActivated;
        this.set(this.theme.getValue());
    }
}
