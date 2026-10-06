import {expect, test} from './fixtures';
import {createCollection, deleteCollections, graphql, login, type Role} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */
for (const role of ['student', 'junior', 'administrator'] satisfies Role[]) {
    test(`${role} can put a new collection inside one of their own collections`, async ({page}) => {
        await login(page, role);
        const parent = await createCollection(page, 'E2E parent');

        try {
            const childName = `E2E child ${Date.now()}`;
            await page.goto('my-collection');
            await page.getByRole('button', {name: 'Créer une collection'}).click();
            const dialog = page.getByRole('dialog', {name: 'Créer une collection'});
            await dialog.getByLabel('Nom', {exact: true}).fill(childName);

            // The parent selector must propose the collections of the user. natural gives its input another accessible
            // name than its label, so locate it otherwise
            await dialog.locator('natural-select-hierarchic[placeholder="Collection parente"] input').click();
            const selector = page.getByRole('dialog', {name: 'Sélection'});
            await selector.getByText(parent.name, {exact: true}).click();
            await selector.getByRole('button', {name: 'Valider'}).click();
            await dialog.getByRole('button', {name: 'Ajouter'}).click();
            await expect(dialog).toBeHidden();

            // The dialog closes before the collection is actually created
            await expect
                .poll(async () => {
                    const data = await graphql<{collections: {items: {parent: {id: string} | null}[]}}>(
                        page,
                        'query ($name: String!) { collections(filter: {groups: [{conditions: [{name: {equal: {value: $name}}}]}]}) { items { parent { id } } } }',
                        {name: childName},
                    );

                    return data.collections.items;
                })
                .toEqual([{parent: {id: parent.id}}]);
        } finally {
            // Also deletes the sub-collection
            await deleteCollections(page, [parent.id]);
        }
    });
}
