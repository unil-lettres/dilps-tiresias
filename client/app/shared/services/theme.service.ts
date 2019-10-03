import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {

    public readonly themes = [
        'default',
    ];
    public readonly theme: BehaviorSubject<string> = new BehaviorSubject(this.themes[0]);
    private darkActivated: boolean;

    constructor() {
        const theme = localStorage.getItem('dilps-theme');
        this.theme.next(theme ? theme : this.themes[0] + 'Dark');
        if (theme && theme.indexOf('Dark') > -1) {
            this.darkActivated = true;
        }
    }

    get isDark() {
        return this.darkActivated;
    }

    public set(theme: string) {
        if (this.darkActivated && theme.indexOf('Dark') === -1) {
            theme += 'Dark';
        } else {
            theme = theme.replace('Dark', '');
        }
        localStorage.setItem('dilps-theme', theme);
        this.theme.next(theme);
    }

    public setNightMode(val: boolean) {
        this.darkActivated = val;
        this.set(this.theme.getValue());
    }

    public toggle() {
        this.setNightMode(!this.darkActivated);
    }

}
