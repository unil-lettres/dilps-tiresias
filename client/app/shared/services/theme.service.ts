import {Injectable} from '@angular/core';
import {NaturalThemeService} from '@ecodev/natural';
import {Site} from '../generated-types';

@Injectable({
    providedIn: 'root',
})
export class ThemeService extends NaturalThemeService {
    public setVariant(site: Site, environment: string): void {
        const cssClassName = {
            [Site.Dilps]: 'dilps',
            [Site.Tiresias]: 'tiresias',
        }[site];

        this.setTheme(`${cssClassName}-${environment}`);
    }
}
