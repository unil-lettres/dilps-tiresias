import {inject, Injectable} from '@angular/core';
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

    public readonly theme = new BehaviorSubject<string>(this.themes[0]);
    private darkActivated = false;

    private storageKey = '';

    public constructor() {
        const site = inject(SITE);

        this.storageKey = site.toLowerCase() + '-theme';

        const theme = localStorage.getItem(this.storageKey);

        if (theme) {
            this.theme.next(theme);
            if (theme.includes('-dark')) {
                this.darkActivated = true;
            }
        }
    }

    public init(site: Site, environment: string): void {
        const cssClassName = {
            [Site.Dilps]: 'dilps',
            [Site.Tiresias]: 'tiresias',
        }[site];
        this.set(`${cssClassName}-${environment}`);
    }

    public set(theme: string): void {
        // Set default theme if stored theme don't exist
        if (!theme || (theme && !this.themes.includes(theme.replace('-dark', '')))) {
            this.set(this.themes[0]);
            return;
        }

        if (this.darkActivated && !theme.includes('-dark')) {
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
