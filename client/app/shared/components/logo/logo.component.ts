import {Component, inject, Input} from '@angular/core';
import {SITE} from '../../../app.config';
import {Site} from '../../generated-types';

@Component({
    selector: 'app-logo',
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss',
    standalone: true,
})
export class LogoComponent {
    public readonly site = inject(SITE);

    @Input() public data = {type: 'main', class: 'logo-main'};
    public Site = Site;

    public path(): string {
        switch (this.site) {
            case Site.Tiresias:
                if (this.data.type === 'main') {
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
