import {type Page} from '@playwright/test';
import {expect, test} from './fixtures';
import {
    asAdministrator,
    type Card,
    clearSearch,
    createCard,
    deleteObjects,
    expectGalleryTitles,
    galleryItem,
    galleryTitles,
    graphql,
    login,
    search,
    searchInput,
} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */

/**
 * Open the home page, and wait for it to be loaded before searching, like a human would
 */
async function openHome(page: Page): Promise<void> {
    await page.goto('home');
    await page.waitForLoadState('networkidle');
}

async function createTwoCards(page: Page, tag: string): Promise<[Card, Card]> {
    const alpha = await createCard(page, {name: `E2E search ${tag} alpha`});
    const beta = await createCard(page, {name: `E2E search ${tag} beta`});

    return [alpha, beta];
}

test('student can combine, remove and clear search terms', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [alpha, beta] = await createTwoCards(page, tag);
    cleanup.add(() => asAdministrator(page, admin => deleteObjects(admin, 'Card', [alpha.id, beta.id])));

    await openHome(page);
    await search(page, tag);
    await expectGalleryTitles(page, [alpha.name, beta.name]);

    // Terms are combined, so that results match all of them
    await search(page, 'alpha');
    await expect(galleryTitles(page)).toHaveText([alpha.name]);

    // Removing a term widens the results again
    await page.locator('natural-search natural-input', {hasText: 'alpha'}).getByRole('button').click();
    await expectGalleryTitles(page, [alpha.name, beta.name]);

    // Clearing the search shows all cards again
    await clearSearch(page);
    await expect(page.locator('natural-search natural-input', {hasText: tag})).toHaveCount(0);
    await expect(page).not.toHaveURL(/ns=/);
    await expect.poll(() => galleryTitles(page).count()).toBeGreaterThan(2);
});

// Known bug: when a search follows another one shortly after its results are shown, eg: right after the page loaded,
// or after cancelling the search, the gallery sometimes keeps the previous results and adds the new ones (the
// counter shows "3 / 1"). The gallery is only cleared when the pagination offset changes to null, and it may still be
// null then. Remove `test.fail()` once fixed.
test('student can add a search term right after the first results are shown', async ({page, cleanup}) => {
    test.fail();
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [alpha, beta] = await createTwoCards(page, tag);
    cleanup.add(() => asAdministrator(page, admin => deleteObjects(admin, 'Card', [alpha.id, beta.id])));

    await page.goto('home');
    for (const term of [tag, 'alpha']) {
        await searchInput(page).fill(term);
        await searchInput(page).press('Enter');
        await expect(galleryTitles(page)).not.toHaveCount(0);
    }
    await page.waitForLoadState('networkidle');

    await expect(galleryTitles(page)).toHaveText([alpha.name]);
});

test('student can search with special characters, as text or as institution', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const card = await createCard(page, {name: `Notre-Dame de Paris ${tag}`, institution: `Notre-Dame ${tag}`});
    cleanup.add(() =>
        asAdministrator(page, async admin => {
            const data = await graphql<{card: {institution: {id: string}}}>(
                admin,
                'query ($id: CardID!) { card(id: $id) { institution { id } } }',
                {id: card.id},
            );
            await deleteObjects(admin, 'Card', [card.id]);
            await deleteObjects(admin, 'Institution', [data.card.institution.id]);
        }),
    );

    // Fulltext operators are taken as word separators, and must not cause an error
    await openHome(page);
    await search(page, 'notre+dame*de-paris', tag);
    await expect(galleryTitles(page)).toHaveText([card.name]);

    // From a new page, because the gallery may mix the results of two searches, see above
    await openHome(page);
    await searchInput(page).click();
    await page.locator('.natural-dropdown-container').getByText('Institution', {exact: true}).click();
    await page.keyboard.type('notre-');
    await page.getByRole('option', {name: `Notre-Dame ${tag}`}).click();
    await page.locator('.natural-dropdown-container').getByRole('button', {name: 'Valider'}).click();
    await expect(galleryTitles(page)).toHaveText([card.name]);
});

test('administrator can include the cards of Tiresias in the search', async ({page}) => {
    await login(page, 'administrator');
    await openHome(page);
    await search(page, 'Test related card');
    await expect(galleryTitles(page)).toHaveText(['Test related card 6005']);

    await searchInput(page).click();
    await page.locator('.natural-dropdown-container').getByText('[Inclure Tiresias]').click();
    await expect(galleryItem(page, 'Test related card 6012')).toHaveCount(1);
    await expect(galleryTitles(page)).toHaveCount(2);
});
