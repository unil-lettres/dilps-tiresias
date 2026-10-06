import {test} from './fixtures';
import {browseAnonymously, login, type Role} from './helpers';

/**
 * Browse the main pages, the fixture fails on any error. Requires the test data of the Dilps site, see `tests/data/`
 */
const pages = ['home', 'my-collection', 'collection', 'source', 'card/6005'];

// Waiting for each page to be fully loaded takes a while
test.describe.configure({timeout: 90_000});

for (const role of ['student', 'junior', 'senior', 'major', 'administrator'] satisfies Role[]) {
    test(`${role} can browse the main pages without any error`, async ({page}) => {
        await login(page, role);

        for (const path of pages) {
            await page.goto(path);
            await page.waitForLoadState('networkidle');
        }
    });
}

test('anonymous can browse the public pages without any error', async ({page}) => {
    await browseAnonymously(page);

    for (const path of ['home', 'card/6005']) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
    }
});
