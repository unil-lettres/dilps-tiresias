import {expect, test} from '@playwright/test';
import {LoginPage} from './login.po';

test.describe('Login page', () => {
    let app: LoginPage;

    test.beforeEach(async ({page}) => {
        app = new LoginPage(page);
    });

    test('with wrong credentials should see an error notification', async () => {
        await app.navigateTo();
        await app.fillCredentials('wrongname', 'wrongpasswd');
        expect(await app.getParagraphText()).toEqual(
            "Veuillez choisir une méthode d'authentification ou\n" + 'utiliser le bouton "Accès public"',
        );
        expect(await app.getErrorMessage()).toEqual("Le nom d'utilisateur ou mot de passe est incorrect");
    });
});
