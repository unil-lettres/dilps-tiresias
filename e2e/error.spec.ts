import {expect, test} from './fixtures';

test('anonymous can see error page', async ({page}) => {
    await page.goto('error');

    await expect(page.locator('h1')).toContainText('Oups, une erreur est survenue');
});
