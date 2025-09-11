import {Component, inject, input} from '@angular/core';
import {SITE} from '../../../app.config';
import {Site} from '../../generated-types';

@Component({
    selector: 'app-logo',
    standalone: true,
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss',
})
export class LogoComponent {
    public readonly site = inject(SITE);

    public readonly data = input({type: 'main', class: 'logo-main'});

    public path(): string {
        switch (this.site) {
            case Site.Tiresias:
                if (this.data().type === 'main') {
                    return 'assets/images/logo-tiresias.svg';
                } else {
                    return 'assets/images/logo-tiresias-mini.svg';
                }
            case Site.Dilps:
            default:
                return 'assets/images/logo-dilps.svg';
        }
    }
}
