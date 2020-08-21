import {AppPage} from './app.po';

describe('dilps app', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display auth message', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual(
            "Veuillez choisir une méthode d'authentification ou\n" + 'utiliser le bouton "Accès public"',
        );
    });
});
