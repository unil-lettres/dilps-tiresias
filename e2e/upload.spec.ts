import {type Page} from '@playwright/test';
import {expect, test} from './fixtures';
import {deleteObjects, getViewer, graphql, images, login} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */

/**
 * The cards created by the current user. No other test creates cards as major, so these are only ours
 */
async function myCards(page: Page): Promise<string[]> {
    const viewer = await getViewer(page);
    const data = await graphql<{cards: {items: {id: string}[]}}>(
        page,
        'query ($creator: ID!) { cards(filter: {groups: [{conditions: [{creator: {equal: {value: $creator}}}]}]}, pagination: {pageSize: 1000}) { items { id } } }',
        {creator: viewer.id},
    );

    return data.cards.items.map(card => card.id);
}

test('major can add images, in JPEG or TIFF, which become their cards', async ({page, cleanup}) => {
    await login(page, 'major');
    const before = await myCards(page);
    const created = async (): Promise<string[]> => (await myCards(page)).filter(id => !before.includes(id));
    cleanup.add(async () => deleteObjects(page, 'Card', await created()));

    await page.goto('home');
    await page.waitForLoadState('networkidle');
    const fileChooser = page.waitForEvent('filechooser');
    await page.locator('button[mattooltip="Ajouter des images"]').click();
    await (await fileChooser).setFiles([images.jpeg, images.tiff]);

    await expect(page.getByText("L'upload est terminé")).toBeVisible({timeout: 15_000});
    await expect(page).toHaveURL(/\/my-collection\/my-cards$/);
    expect(await created()).toHaveLength(2);

    // The new cards are shown, with an image that browsers can show, even for the TIFF
    for (const id of await created()) {
        const image = page.locator(`natural-gallery img[src^="/api/image/${id}/"]`);
        await expect(image).toBeVisible();
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    }
});
