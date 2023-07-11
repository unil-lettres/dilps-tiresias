import {Component, Inject, Input} from '@angular/core';
import {SITE} from '../../../app.config';
import {Site} from '../../generated-types';

@Component({
    selector: 'app-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
    standalone: true,
})
export class LogoComponent {
    @Input() public data = {type: 'main', class: 'logo-main'};
    public Site = Site;

    public constructor(@Inject(SITE) public readonly site: Site) {}

    public path(): string {
        switch (this.site) {
            case Site.tiresias:
                if (this.data.type === 'main') {
                    return 'assets/images/logo-tiresias.svg';
                } else {
                    return 'assets/images/logo-tiresias-mini.svg';
                }
            case Site.dilps:
            default:
                return 'assets/images/logo-dilps.svg';
        }
    }
}
