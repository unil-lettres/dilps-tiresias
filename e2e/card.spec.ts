import {expect, test} from './fixtures';
import {browseAnonymously, createCollection, deleteCollections, graphql, login} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */
test('student can only remove a card from the collections they manage', async ({page}) => {
    await login(page, 'student');

    // Card 6001 of the student is also in collection 2001, that the student does not manage
    const collection = await createCollection(page, 'E2E card');
    try {
        await graphql(
            page,
            'mutation ($collection: CollectionID!) { linkCardCollection(card: 6001, collection: $collection) { id } }',
            {
                collection: collection.id,
            },
        );

        await page.goto('card/6001');
        await page.locator('button[mattooltip="Ajouter ou retirer la fiche d\'une collection"]').click();
        const dialog = page.getByRole('dialog');
        const removeButton = 'button[mattooltip="Retirer la fiche de la collection"]';

        const managed = dialog.locator('.nat-horizontal', {hasText: collection.name});
        await expect(managed.locator(removeButton)).toHaveCount(1);

        const other = dialog.locator('.nat-horizontal', {hasText: 'Test collection 2001'});
        await expect(other).toHaveCount(1);
        await expect(other.locator(removeButton)).toHaveCount(0);
    } finally {
        await deleteCollections(page, [collection.id]);
    }
});

test('student can export a card', async ({page}) => {
    await login(page, 'student');
    await page.goto('card/6005');

    await expect(page.locator('app-export-menu button')).not.toHaveCount(0);
});

test('anonymous cannot export a card', async ({page}) => {
    await browseAnonymously(page);
    await page.goto('card/6005');

    // Make sure the card is shown, before checking that something is not
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Test related card 6005').first()).toBeVisible();

    await expect(page.locator('app-export-menu button')).toHaveCount(0);
});
