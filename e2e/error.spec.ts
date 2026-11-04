import {expect, test} from './fixtures';
import {login} from './helpers';

test('anonymous can see error page', async ({page}) => {
    await page.goto('error');

    await expect(page.locator('h1')).toContainText('Oups, une erreur est survenue');
});

for (const [path, message] of [
    ['card/6000', "Cette fiche n'existe pas ou vous n'y avez pas accès."],
    ['collection/2008', "Cette collection n'existe pas ou vous n'y avez pas accès."],
    ['my-collection/2008', "Cette collection n'existe pas ou vous n'y avez pas accès."],
    ['notification/7000', "Cette suggestion n'existe pas ou vous n'y avez pas accès."],
    ['notification/new/6000', "Cette fiche n'existe pas ou vous n'y avez pas accès."],
]) {
    test(`junior sees the error page when opening ${path}, which they cannot see`, async ({page, problems}) => {
        problems.allow(/Entity not found/);
        await login(page, 'junior');

        await page.goto(path);

        await expect(page.locator('h1')).toContainText('Oups, une erreur est survenue');
        await expect(page.locator('app-error p')).toHaveText(message);
    });
}
