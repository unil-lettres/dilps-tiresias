import {expect, test} from './fixtures';
import {createCollection, deleteCollections, findCollections, login, type Role, uniqueName} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */
for (const role of ['student', 'junior', 'administrator'] satisfies Role[]) {
    test(`${role} can put a new collection inside one of their own collections`, async ({page, cleanup}) => {
        await login(page, role);
        const parent = await createCollection(page, 'E2E parent');
        const childName = uniqueName('E2E child');
        cleanup.add(async () => {
            // The child is deleted with its parent, unless it was wrongly created elsewhere
            const children = await findCollections(page, childName);
            await deleteCollections(page, [parent.id, ...children.map(child => child.id)]);
        });

        await page.goto('my-collection');
        await page.getByRole('button', {name: 'Créer une collection'}).click();
        const dialog = page.getByRole('dialog', {name: 'Créer une collection'});
        await dialog.getByLabel('Nom', {exact: true}).fill(childName);

        // The parent selector must propose the collections of the user. natural gives its input another accessible
        // name than its label, so locate it otherwise
        const parentInput = dialog.locator('natural-select-hierarchic[placeholder="Collection parente"] input');
        await parentInput.click();
        const selector = page.getByRole('dialog', {name: 'Sélection'});
        await selector.getByText(parent.name, {exact: true}).click();
        await selector.getByRole('button', {name: 'Valider'}).click();

        // The parent is only set once the selector is closed
        await expect(parentInput).toHaveValue(new RegExp(parent.name));
        await dialog.getByRole('button', {name: 'Ajouter'}).click();
        await expect(dialog).toBeHidden();

        // The dialog closes before the collection is actually created
        await expect
            .poll(async () => (await findCollections(page, childName)).map(child => child.parent?.id))
            .toEqual([parent.id]);
    });
}
