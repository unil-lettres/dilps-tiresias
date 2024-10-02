import {Component, inject} from '@angular/core';
import {SITE} from '../app.config';
import {Site} from '../shared/generated-types';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
})
export class WelcomeComponent {
    public readonly site = inject<Site>(SITE);

    public Site = Site;

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
