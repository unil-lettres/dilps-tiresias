import {type Locator, type Page} from '@playwright/test';
import {expect, test} from './fixtures';
import {
    createCard,
    createCollection,
    deleteCollections,
    deleteObjects,
    findCollections,
    graphql,
    login,
    type Role,
    type Session,
    uniqueName,
} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */

type CollectionFields = {
    name: string;
    description: string;
    visibility: string;
    isSource: boolean;
    usageRights: string;
    copyrights: string;
};

async function getCollection(session: Session, id: string): Promise<CollectionFields> {
    const data = await graphql<{collection: CollectionFields}>(
        session,
        'query ($id: CollectionID!) { collection(id: $id) { name description visibility isSource usageRights copyrights } }',
        {id},
    );

    return data.collection;
}

/**
 * The collection of the given name in the list of collections
 */
function collectionItem(page: Page, name: string): Locator {
    return page.locator('mat-list-item.collection-item', {has: page.locator('a.collection-link', {hasText: name})});
}

/**
 * Open the dialog of a collection via its actions menu, and wait for it to be reloaded, as shown by its title,
 * otherwise the reload would overwrite what we type
 */
async function openCollectionAction(page: Page, name: string, action: string, title: string): Promise<Locator> {
    // The actions button is only shown while hovering its collection
    const item = collectionItem(page, name);
    await item.hover();
    await item.getByRole('button', {name: 'Actions de la collection'}).click();
    await page.getByRole('menuitem', {name: action}).click();

    const dialog = page.getByRole('dialog', {name: title});
    await expect(dialog).toBeVisible();
    await page.waitForLoadState('networkidle');

    return dialog;
}

async function openCollectionEdition(page: Page, name: string): Promise<Locator> {
    return openCollectionAction(page, name, 'Modifier', 'Modifier la collection');
}

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

test('student can expand and collapse their collections', async ({page, cleanup}) => {
    await login(page, 'student');
    const parent = await createCollection(page, 'E2E parent');
    cleanup.add(() => deleteCollections(page, [parent.id]));
    const child = await createCollection(page, 'E2E child', {parent: parent.id});

    await page.goto('my-collection');
    await expect(collectionItem(page, parent.name)).toBeVisible();
    await expect(collectionItem(page, child.name)).toHaveCount(0);

    await collectionItem(page, parent.name).getByRole('button', {name: 'Développer la collection'}).click();
    await expect(collectionItem(page, child.name)).toBeVisible();

    await collectionItem(page, parent.name).getByRole('button', {name: 'Réduire la collection'}).click();
    await expect(collectionItem(page, child.name)).toHaveCount(0);
});

test('student can rename and describe their collection', async ({page, cleanup}) => {
    await login(page, 'student');
    const collection = await createCollection(page, 'E2E collection');
    cleanup.add(() => deleteCollections(page, [collection.id]));
    const name = uniqueName('E2E renamed');

    await page.goto('my-collection');
    const dialog = await openCollectionEdition(page, collection.name);
    await expect(dialog).toContainText('Vous êtes propriétaire de cette collection');

    await dialog.getByLabel('Nom', {exact: true}).fill(name);
    await dialog.getByLabel('Description').fill('E2E description');
    await dialog.getByRole('button', {name: 'Enregistrer'}).click();
    await expect(dialog).toBeHidden();

    expect(await getCollection(page, collection.id)).toMatchObject({name, description: 'E2E description'});
    await expect(collectionItem(page, name)).toBeVisible();
});

test('student can submit their collection to administrators, but not make it visible to members', async ({
    page,
    cleanup,
}) => {
    await login(page, 'student');
    const collection = await createCollection(page, 'E2E collection');
    cleanup.add(() => deleteCollections(page, [collection.id]));

    await page.goto('my-collection');
    const dialog = await openCollectionEdition(page, collection.name);
    await expect(dialog).toContainText('Visible par moi et les abonné·es');

    const slider = dialog.getByRole('slider');
    await slider.press('ArrowRight');
    await slider.press('ArrowRight');
    await expect(dialog).toContainText('Visible par moi, les admins et les abonné·es');
    await dialog.getByRole('button', {name: 'Enregistrer'}).click();
    await expect(dialog).toBeHidden();

    expect((await getCollection(page, collection.id)).visibility).toBe('Administrator');
});

test('senior can make their collection visible to members', async ({page, cleanup}) => {
    await login(page, 'senior');
    const collection = await createCollection(page, 'E2E collection');
    cleanup.add(() => deleteCollections(page, [collection.id]));

    await page.goto('my-collection');
    const dialog = await openCollectionEdition(page, collection.name);
    await expect(dialog).toContainText('Visible par moi et les abonné·es');

    const slider = dialog.getByRole('slider');
    await slider.press('ArrowRight');
    await slider.press('ArrowRight');
    await expect(dialog).toContainText('Visible par les membres');
    await dialog.getByRole('button', {name: 'Enregistrer'}).click();
    await expect(dialog).toBeHidden();

    expect((await getCollection(page, collection.id)).visibility).toBe('Member');
});

test('administrator can make a collection a fonds, with its rights', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const collection = await createCollection(page, 'E2E fonds');
    cleanup.add(() => deleteCollections(page, [collection.id]));

    await page.goto('my-collection');
    const dialog = await openCollectionEdition(page, collection.name);
    await expect(dialog.getByLabel("Droits d'utilisation")).toHaveCount(0);

    await dialog.getByRole('checkbox', {name: 'Est un fonds'}).check();
    await dialog.getByLabel("Droits d'utilisation").fill('E2E usage rights');
    await dialog.getByLabel('Copyrights').fill('E2E copyrights');
    await dialog.getByRole('button', {name: 'Enregistrer'}).click();
    await expect(dialog).toBeHidden();

    expect(await getCollection(page, collection.id)).toMatchObject({
        isSource: true,
        usageRights: 'E2E usage rights',
        copyrights: 'E2E copyrights',
    });

    // A fonds is listed with the fonds, not with the other collections anymore
    await page.goto('source');
    await expect(collectionItem(page, collection.name)).toBeVisible();
});

test('student can add a reader to their collection, who then sees it', async ({page, browser, cleanup}) => {
    await login(page, 'student');
    const collection = await createCollection(page, 'E2E shared');
    cleanup.add(() => deleteCollections(page, [collection.id]));

    await page.goto('my-collection');
    const dialog = await openCollectionAction(
        page,
        collection.name,
        'Gérer les abonné·es',
        `Gérer les abonné·es de la collection « ${collection.name} »`,
    );
    await dialog.locator('natural-relations[placeholder="Ajouter un·e lecteur·rice"] input').fill('junior');
    await page.getByRole('option', {name: 'junior'}).click();
    await expect(dialog.locator('natural-relations[placeholder="Ajouter un·e lecteur·rice"]')).toContainText('junior');
    await dialog.getByRole('button', {name: 'Terminer'}).click();
    await expect(dialog).toBeHidden();

    const reader = await browser.newPage();
    try {
        await login(reader, 'junior');
        await reader.goto('my-collection');
        await expect(collectionItem(reader, collection.name)).toBeVisible();
    } finally {
        await reader.close();
    }
});

test('student can delete their collection', async ({page, cleanup}) => {
    await login(page, 'student');
    const collection = await createCollection(page, 'E2E deleted');
    cleanup.add(() => deleteCollections(page, [collection.id]));

    await page.goto('my-collection');
    const dialog = await openCollectionEdition(page, collection.name);
    await dialog.getByRole('button', {name: 'Supprimer'}).click();
    const confirm = page.getByRole('dialog').filter({hasText: 'Cette action est irréversible'});
    await expect(confirm).toContainText(`Supprimer la collection « ${collection.name} » pour tout le monde ?`);
    await confirm.getByRole('button', {name: 'Supprimer définitivement'}).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    expect(await findCollections(page, collection.name)).toEqual([]);
    await expect(collectionItem(page, collection.name)).toHaveCount(0);
});

test('administrator comes back from a card to the same list, in each kind of collection', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const card = await createCard(page);
    const collection = await createCollection(page, 'E2E list');
    const fonds = await createCollection(page, 'E2E fonds', {isSource: true});
    cleanup.add(async () => {
        await deleteObjects(page, 'Card', [card.id]);
        await deleteCollections(page, [collection.id, fonds.id]);
    });
    for (const {id} of [collection, fonds]) {
        await graphql(
            page,
            'mutation ($card: CardID!, $collection: CollectionID!) { linkCardCollection(card: $card, collection: $collection) { id } }',
            {card: card.id, collection: id},
        );
    }

    for (const url of ['home', 'my-collection/my-cards', `my-collection/${collection.id}`, `source/${fonds.id}`]) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');

        // Mark the list, to know whether it is kept, with its scroll position, or created again
        await page.locator('app-list').evaluate(element => ((element as HTMLElement).dataset.marked = 'yes'));
        await page.locator(`natural-gallery figure:has(img[src^="/api/image/${card.id}/"]) button.activation`).click();
        await expect(page).toHaveURL(new RegExp(`/card/${card.id}$`));
        await page.waitForLoadState('networkidle');

        await page.goBack();
        await expect(page.locator('app-list'), url).toHaveAttribute('data-marked', 'yes');
    }
});

test('a collection cannot be created without name', async ({page}) => {
    await login(page, 'student');
    await page.goto('my-collection');
    await page.getByRole('button', {name: 'Créer une collection'}).click();
    const dialog = page.getByRole('dialog', {name: 'Créer une collection'});
    const add = dialog.getByRole('button', {name: 'Ajouter'});

    await expect(add).toBeDisabled();
    await dialog.getByLabel('Nom', {exact: true}).fill('E2E name');
    await expect(add).toBeEnabled();
});
