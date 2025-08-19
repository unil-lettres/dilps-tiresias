import {Component, inject} from '@angular/core';
import {SITE} from '../app.config';
import {Site} from '../shared/generated-types';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    imports: [MatDialogModule, MatButtonModule],
})
export class WelcomeComponent {
    public readonly site = inject(SITE);

    public getTitle(): string {
        switch (this.site) {
            case Site.Tiresias:
                return 'Bienvenue sur Tirésias';
            case Site.Dilps:
            default:
                return 'Bienvenue sur Dilps';
        }
    }

    public getContent(): string {
        switch (this.site) {
            case Site.Tiresias:
                return "La banque d'images de l'Institut d'archéologie et des sciences de l'Antiquité de l'Université de Lausanne.";
            case Site.Dilps:
            default:
                return "La banque d'images de la section d'histoire de l'art de l'Université de Lausanne.";
        }
    }
}
