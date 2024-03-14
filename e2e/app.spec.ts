import {expect, test} from '@playwright/test';
import {AppPage} from './app.po';

test.describe('dilps app', () => {
    let app: AppPage;

    test.beforeEach(({page}) => {
        app = new AppPage(page);
    });

    test('should display auth message', async () => {
        await app.navigateTo();
        expect(await app.getParagraphText()).toEqual(
            "Veuillez choisir une méthode d'authentification ou\n" + 'utiliser le bouton "Accès public"',
        );
    });
});
