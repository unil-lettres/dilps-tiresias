import {type Page} from '@playwright/test';
import {expect, test} from './fixtures';
import {
    asAdministrator,
    type Card,
    createCard,
    createCards,
    createCollection,
    deleteObjects,
    findIds,
    galleryItem,
    graphql,
    login,
    openExportMenu,
    openSearch,
    selectCards,
    selectionAction,
    uniqueName,
} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */

async function getCollectionCards(page: Page, collection: {id: string}): Promise<string[]> {
    const data = await graphql<{cards: {items: {id: string}[]}}>(
        page,
        'query ($id: ID!) { cards(filter: {groups: [{conditions: [{collections: {have: {values: [$id]}}}]}]}) { items { id } } }',
        {id: collection.id},
    );

    return data.cards.items.map(card => card.id).sort();
}

function ids(cards: Card[]): string[] {
    return cards.map(card => card.id).sort();
}

test('student can add the selected cards to a new collection', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const cards = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    const name = uniqueName('E2E new collection');
    cleanup.add(async () => deleteObjects(page, 'Collection', await findIds(page, 'Collection', name)));

    await openSearch(page, tag);
    await selectCards(page, cards);
    await selectionAction(
        page,
        "Ajouter ou retirer les fiches sélectionnées d'une collection",
        'Ajouter à une collection',
    );
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('tab', {name: 'Nouvelle collection'}).click();
    await dialog.getByLabel('Nom').fill(name);
    await dialog.getByRole('button', {name: 'Ajouter à une nouvelle collection privée'}).click();
    await expect(dialog).toBeHidden();

    await expect
        .poll(async () => {
            const [collection] = await findIds(page, 'Collection', name);

            return collection ? getCollectionCards(page, {id: collection}) : [];
        })
        .toEqual(ids(cards));
});

test('the gallery shown again after a card survives the creation of a collection', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [card] = await createCards(page, cleanup, [`E2E ${tag}`]);
    const name = uniqueName('E2E new collection');
    cleanup.add(async () => deleteObjects(page, 'Collection', await findIds(page, 'Collection', name)));

    // The gallery is kept while the card is shown, and shown again when coming back
    await openSearch(page, tag);
    await galleryItem(page, card.name).getByRole('button', {name: 'activate item'}).click();
    await expect(page).toHaveURL(new RegExp(`/card/${card.id}$`));
    await page.goBack();

    await selectCards(page, [card]);
    await selectionAction(
        page,
        "Ajouter ou retirer les fiches sélectionnées d'une collection",
        'Ajouter à une collection',
    );
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('tab', {name: 'Nouvelle collection'}).click();
    await dialog.getByLabel('Nom').fill(name);
    await dialog.getByRole('button', {name: 'Ajouter à une nouvelle collection privée'}).click();
    await expect(dialog).toBeHidden();

    await expect(page.locator('natural-gallery figcaption')).toHaveText([card.name]);
    await expect(page.locator('app-list .background-selection')).toContainText('1 fiche sélectionnée');
});

test('student can add the selected cards to one of their collections', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const cards = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    const collection = await createCollection(page, 'E2E existing collection');
    cleanup.add(() => deleteObjects(page, 'Collection', [collection.id]));

    await openSearch(page, tag);
    await selectCards(page, cards);
    await selectionAction(
        page,
        "Ajouter ou retirer les fiches sélectionnées d'une collection",
        'Ajouter à une collection',
    );
    const dialog = page.getByRole('dialog');
    await dialog.locator('natural-select[placeholder="Sélectionnez la collection"] input').fill(collection.name);
    await page.getByRole('option', {name: collection.name}).click();
    await dialog.getByRole('button', {name: 'Ajouter à la collection'}).click();
    await expect(dialog).toBeHidden();

    await expect.poll(() => getCollectionCards(page, collection)).toEqual(ids(cards));
});

/**
 * Record the inputs of the exports that the page creates
 */
function recordExports(page: Page): Record<string, unknown>[] {
    const exports: Record<string, unknown>[] = [];
    page.on('request', request => {
        const body = request.postDataJSON() as {operationName?: string; variables?: {input: unknown}}[] | null;
        for (const operation of [body ?? []].flat()) {
            if (operation.operationName === 'CreateExport') {
                exports.push(operation.variables!.input as Record<string, unknown>);
            }
        }
    });

    return exports;
}

test('student can export the selected cards as zip', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const cards = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    await openSearch(page, tag);
    await selectCards(page, cards);

    await openExportMenu(page);
    const download = page.waitForEvent('download');
    await page.getByRole('menuitem', {name: 'Exporter les fiches'}).click();
    expect((await download).suggestedFilename()).toMatch(/\.zip$/);
});

test('student can export the selected cards as PowerPoint, with the chosen theme', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const cards = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    const exports = recordExports(page);
    await openSearch(page, tag);
    await selectCards(page, cards);

    await openExportMenu(page);
    await page.getByRole('menuitem', {name: 'Exporter en PowerPoint'}).click();
    const download = page.waitForEvent('download');
    await page.getByRole('menuitem', {name: 'Thème clair'}).click();
    expect((await download).suggestedFilename()).toMatch(/\.pptx$/);
    await page.waitForLoadState('networkidle');

    expect(exports.map(input => [input.format, input.backgroundColor])).toEqual([['Pptx', '#FFFFFF']]);
});

test('senior can edit the selected cards at once, without losing the fields left empty', async ({page, cleanup}) => {
    await login(page, 'senior');
    const tag = crypto.randomUUID();
    const artist = `E2E artist ${tag}`;
    const cards: Card[] = [];
    for (const name of [`E2E ${tag} 1`, `E2E ${tag} 2`]) {
        cards.push(await createCard(page, {name, artists: [artist], addition: 'Kept'}));
    }
    cleanup.add(async () => {
        await deleteObjects(page, 'Card', ids(cards));
        await asAdministrator(page, async admin =>
            deleteObjects(admin, 'Artist', await findIds(admin, 'Artist', artist)),
        );
    });

    await openSearch(page, tag);
    await selectCards(page, cards);
    await selectionAction(page, 'Editer en masse la sélection', 'Éditer en masse');
    const dialog = page.getByRole('dialog', {name: 'Edition de masse'});
    await dialog.getByLabel('Datation').fill('1900');
    await dialog.getByRole('button', {name: 'Valider'}).click();
    await expect(page.getByText('Mis à jour')).toBeVisible();

    for (const card of cards) {
        const data = await graphql<{
            card: {name: string; dating: string; addition: string; artists: {name: string}[]};
        }>(page, 'query ($id: CardID!) { card(id: $id) { name dating addition artists { name } } }', {id: card.id});
        expect(data.card).toEqual({name: card.name, dating: '1900', addition: 'Kept', artists: [{name: artist}]});
    }
});

test('administrator can delete the selected cards', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const tag = crypto.randomUUID();
    const cards = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    const kept = await createCard(page, {name: `E2E ${tag} kept`});
    cleanup.add(() => deleteObjects(page, 'Card', [kept.id]));

    await openSearch(page, tag);
    await selectCards(page, cards);
    await selectionAction(page, 'Supprimer les fiches sélectionnées définitivement', 'Supprimer définitivement');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('2 fiche(s)');
    await dialog.getByRole('button', {name: 'Supprimer définitivement'}).click();
    await expect(page.getByText('Supprimé')).toBeVisible();

    const data = await graphql<{cards: {items: Card[]}}>(
        page,
        'query ($tag: String!) { cards(filter: {groups: [{conditions: [{custom: {search: {value: $tag}}}]}]}) { items { id name } } }',
        {tag},
    );
    expect(data.cards.items).toEqual([kept]);
});
