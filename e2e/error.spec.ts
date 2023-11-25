import {expect, test} from '@playwright/test';

test('anonymous can see error page', async ({page}) => {
    await page.goto('error');

    expect(await page.innerText('h1')).toMatch('Oups, une erreur est survenue');
});
