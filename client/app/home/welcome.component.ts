import {Component, inject} from '@angular/core';
import {SITE} from '../app.config';
import {Site} from '../shared/generated-types';
import {MatButton} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-welcome',
    imports: [MatDialogModule, MatButton],
    templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
    protected readonly site = inject(SITE);

    protected getTitle(): string {
        switch (this.site) {
            case Site.Tiresias:
                return 'Bienvenue sur Tirésias';
            case Site.Dilps:
            default:
                return 'Bienvenue sur Dilps';
        }
    }

    protected getContent(): string {
        switch (this.site) {
            case Site.Tiresias:
                return "La banque d'images de l'Institut d'archéologie et des sciences de l'Antiquité de l'Université de Lausanne.";
            case Site.Dilps:
            default:
                return "La banque d'images de la section d'histoire de l'art de l'Université de Lausanne.";
        }
    }
}
