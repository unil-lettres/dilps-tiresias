import {Component, Inject} from '@angular/core';
import {SITE} from '../app.config';
import {Site} from '../shared/generated-types';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
    public Site = Site;

    public constructor(@Inject(SITE) public readonly site: Site) {}

    public getTitle(): string {
        switch (this.site) {
            case Site.tiresias:
                return 'Bienvenue sur Tirésias';
            case Site.dilps:
            default:
                return 'Bienvenue sur Dilps';
        }
    }

    public getContent(): string {
        switch (this.site) {
            case Site.tiresias:
                return "La banque d'images de l'Institut d'archéologie et des sciences de l'Antiquité de l'Université de Lausanne.";
            case Site.dilps:
            default:
                return "La banque d'images de la section d'histoire de l'art de l'Université de Lausanne.";
        }
    }
}
