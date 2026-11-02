import {type Locator, type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {expect, test} from './fixtures';
import {
    createCard,
    deleteCollections,
    deleteObjects,
    type FileToUpload,
    findIds,
    galleryAction,
    graphql,
    images,
    login,
    openExportMenu,
    openSearch,
    type Role,
    selectButton,
    selectCards,
    selectionAction,
    uniqueName,
} from './helpers';

/**
 * Run on the Tiresias site, see playwright.config.ts. Requires the test data of the Tiresias site, see `tests/data/`
 */

// Waiting for each page to be fully loaded takes a while
test.describe.configure({timeout: 90_000});

const pages = ['home', 'my-collection', 'collection', 'source', 'card/6012'];
const administrationPages = [
    'domain',
    'period',
    'material',
    'institution',
    'antique-name',
    'document-type',
    'tag',
    'user',
    'news',
    'statistic',
];

for (const role of ['student', 'junior', 'senior', 'major', 'administrator'] satisfies Role[]) {
    test(`${role} can browse the main pages of Tiresias without any error`, async ({page}) => {
        await login(page, role);

        for (const path of role === 'administrator' ? [...pages, ...administrationPages] : pages) {
            await page.goto(path);
            await page.waitForLoadState('networkidle');
        }
    });
}

test('anonymous can browse the public cards via the public access', async ({page}) => {
    await page.goto('login');

    // It is an anchor without href, so it has no role
    await page.getByText('Accès public', {exact: true}).click();
    await expect(page).toHaveURL(/\/home/);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('natural-gallery figcaption', {hasText: 'Test related card 6012'})).toHaveCount(1);
    await expect(page.locator('natural-gallery figcaption', {hasText: 'Test card 6007'})).toHaveCount(0);
});

async function cardsOfCollection(page: Page, collection: string): Promise<{id: string; name: string}[]> {
    const data = await graphql<{cards: {items: {id: string; name: string}[]}}>(
        page,
        'query ($id: ID!) { cards(filter: {groups: [{conditions: [{collections: {have: {values: [$id]}}}]}]}) { items { id name } } }',
        {id: collection},
    );

    return data.cards.items;
}

/**
 * Delete the collections of the given name, and the cards in them
 */
async function deleteCollectionsWithCards(page: Page, name: string): Promise<void> {
    for (const id of await findIds(page, 'Collection', name)) {
        await deleteObjects(
            page,
            'Card',
            (await cardsOfCollection(page, id)).map(card => card.id),
        );
        await deleteCollections(page, [id]);
    }
}

/**
 * Upload files, into a new collection, because Tiresias requires one
 */
async function uploadToNewCollection(page: Page, files: FileToUpload[], name: string): Promise<void> {
    const fileChooser = page.waitForEvent('filechooser');
    await page.locator('button[mattooltip="Ajouter des images"]').click();
    await (await fileChooser).setFiles(files);

    const dialog = page.getByRole('dialog');
    await dialog.getByRole('tab', {name: 'Nouvelle collection'}).click();
    await dialog.getByLabel('Nom').fill(name);
    await dialog.getByRole('button', {name: 'Ajouter à une nouvelle collection privée'}).click();
}

/**
 * A unique name for a collection, short enough for the code of its cards, see below
 */
function shortUniqueName(): string {
    return `E2E ${crypto.randomUUID().slice(0, 8)}`;
}

test('administrator sees all the fields of Tiresias when editing a card', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const card = await createCard(page);
    cleanup.add(() => deleteObjects(page, 'Card', [card.id]));

    await page.goto(`card/${card.id}`);
    await page.locator('button[mattooltip="Passer en mode édition"]').click();
    const form = page.locator('app-card .left-pane');

    for (const label of [
        'Référence',
        'Titre',
        'Domaines',
        'Description',
        'Corpus',
        'Matériaux',
        'Lieu de production',
        'Mots clés',
        'Lieux de découverte',
        'Nom antique',
        'Périodes',
        'A partir de',
        "Jusqu'à",
        'Lieu de conservation',
        'Institution',
        'Numéro d’inventaire',
        'Référence du document',
        'Type',
        'Dimensions',
        'Auteur',
        'Date ou année',
        "Référence de l'image",
        'Source',
        'ISBN / ISSN',
        'Référence web',
        'URL',
        'Fiches associées',
    ]) {
        await expect(form.getByText(label, {exact: true}).first(), label).toBeVisible();
    }
});

test('administrator can edit cards at once without an horizontal scroll', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const tag = crypto.randomUUID();
    const cards = [await createCard(page, {name: `E2E ${tag} 1`}), await createCard(page, {name: `E2E ${tag} 2`})];
    cleanup.add(() =>
        deleteObjects(
            page,
            'Card',
            cards.map(card => card.id),
        ),
    );

    await openSearch(page, tag);
    await selectCards(page, cards);
    await selectionAction(page, 'Editer en masse la sélection', 'Éditer en masse');
    const content = page.getByRole('dialog', {name: 'Edition de masse'}).locator('mat-dialog-content');
    await expect(content.getByLabel('A partir de')).toBeVisible();

    // Fields side by side, like "A partir de" and "Jusqu'à", must fit in the dialog
    expect(await content.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0);
});

/**
 * The button of the selection that shows it on a map. Its tooltip changes, so it is found by its icon
 */
function mapButton(page: Page): Locator {
    return page.locator('app-list .background-selection button:has(mat-icon[data-mat-icon-name="map"])');
}

const location = {latitude: 46.5197, longitude: 6.6323, precision: 'Locality'};

test('administrator can show the selected cards on a map, and find the selection intact when closing it', async ({
    page,
    cleanup,
}) => {
    await login(page, 'administrator');
    const tag = crypto.randomUUID();
    const located = await createCard(page, {name: `E2E ${tag} located`, ...location});
    const other = await createCard(page, {name: `E2E ${tag} other`});
    cleanup.add(() => deleteObjects(page, 'Card', [located.id, other.id]));

    await openSearch(page, tag);
    await selectCards(page, [located, other]);
    await mapButton(page).click();

    // Google Maps is loaded from the internet, which may take a while
    const map = page.locator('app-view-map');
    await expect(map.locator('google-map')).toBeVisible({timeout: 15_000});
    await expect(map).toContainText('1 fiche sur 2 est localisée');

    await page.keyboard.press('Escape');
    await expect(map).toHaveCount(0);
    await expect(page.locator('app-list .background-selection')).toContainText('2 fiches sélectionnées');
    await expect(selectButton(page, located.name)).toHaveAttribute('aria-checked', 'true');
});

test('the map cannot be opened for cards without location', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const tag = crypto.randomUUID();
    const card = await createCard(page, {name: `E2E ${tag}`});
    cleanup.add(() => deleteObjects(page, 'Card', [card.id]));

    await openSearch(page, tag);
    await selectCards(page, [card]);
    await expect(mapButton(page)).toHaveAttribute('aria-disabled', 'true');
    await mapButton(page).hover();
    await expect(page.locator('mat-tooltip-component')).toHaveText("Aucune fiche sélectionnée n'est localisée");

    // Playwright refuses to click a disabled button, even if it stays interactive for its tooltip
    await mapButton(page).click({force: true});
    await expect(page.locator('app-view-map')).toHaveCount(0);

    // Also from the menu of the selection, when the toolbar is too narrow for its buttons
    await page.setViewportSize({width: 700, height: 720});
    await page.locator('app-list .background-selection button[mattooltip="Actions sur la sélection"]').click();
    await expect(page.getByRole('menuitem', {name: 'Voir sur la carte'})).toBeDisabled();
});

test('administrator can search the cards around a card of the map', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const tag = crypto.randomUUID();
    const card = await createCard(page, {name: `E2E ${tag}`, ...location});
    cleanup.add(() => deleteObjects(page, 'Card', [card.id]));

    await openSearch(page, tag);
    await selectCards(page, [card]);
    await mapButton(page).click();

    await expect(page.locator('app-view-map')).toContainText('1 fiche sur 1 est localisée');
    const marker = page.locator('app-view-map img[src*="gmap_"]').first();
    await expect(marker).toBeVisible({timeout: 15_000});
    await marker.click({force: true});
    await page.getByRole('button', {name: 'Rechercher les fiches à proximité'}).click();

    await expect(page.locator('app-view-map')).toHaveCount(0);
    await expect(page.locator('natural-search natural-input', {hasText: 'à 200 m de'})).toHaveCount(1);
    await expect(page.locator('app-list .background-selection')).toHaveCount(0);
});

test('administrator can export the selected cards to Excel', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const tag = crypto.randomUUID();
    const card = await createCard(page, {name: `E2E ${tag}`});
    cleanup.add(() => deleteObjects(page, 'Card', [card.id]));

    await openSearch(page, tag);
    await selectCards(page, [card]);
    await openExportMenu(page);

    // A CSV, that Excel opens
    const download = page.waitForEvent('download');
    await page.getByRole('menuitem', {name: 'Exporter en Excel'}).click();
    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
});

test('administrator can add images into a new collection', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const collection = shortUniqueName();
    cleanup.add(() => deleteCollectionsWithCards(page, collection));

    await page.goto('home');
    await page.waitForLoadState('networkidle');
    await uploadToNewCollection(page, [images.jpeg], collection);
    await expect(page.getByText("L'upload est terminé")).toBeVisible({timeout: 15_000});

    const [id] = await findIds(page, 'Collection', collection);
    await expect(page).toHaveURL(new RegExp(`/my-collection/${id}$`));
    expect(await cardsOfCollection(page, id)).toHaveLength(1);
});

// The code of a card added to a collection by an administrator or a major is made of the name of the collection,
// shortened to fit in 30 characters
test('administrator can add images into a new collection with a long name', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const collection = uniqueName('E2E collection with a long name');
    cleanup.add(() => deleteCollectionsWithCards(page, collection));

    await page.goto('home');
    await page.waitForLoadState('networkidle');
    await uploadToNewCollection(page, [images.jpeg], collection);
    await expect(page.getByText("L'upload est terminé")).toBeVisible({timeout: 15_000});
});

test('administrator can import images with their data from an Excel file', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const collection = shortUniqueName();
    cleanup.add(() => deleteCollectionsWithCards(page, collection));

    // The template to fill can be downloaded
    await page.goto('home');
    await page.waitForLoadState('networkidle');
    await page.locator('button[mattooltip="Importer avec métadonnées (Excel)"]').click();
    const dialog = page.getByRole('dialog', {name: 'Comment importer avec métadonnées ?'});
    const download = page.waitForEvent('download');
    await dialog.getByRole('link', {name: 'Télécharger le modèle Excel'}).click();
    expect((await download).suggestedFilename()).toMatch(/\.xlsx$/);

    // The Excel file, filled like the template, is uploaded with the images it names
    const excel = {
        name: 'import.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: readFileSync(join(__dirname, 'files/import.xlsx')),
    };
    await uploadToNewCollection(page, [excel, images.jpeg], collection);

    await expect.poll(async () => (await findIds(page, 'Collection', collection)).length).toBe(1);
    const [id] = await findIds(page, 'Collection', collection);
    await expect(page).toHaveURL(new RegExp(`/my-collection/${id}$`));
    expect((await cardsOfCollection(page, id)).map(card => card.name)).toEqual(['E2E imported from Excel']);
});
