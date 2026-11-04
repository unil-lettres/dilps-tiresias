import {type Locator, type Page} from '@playwright/test';
import {expect, test} from './fixtures';
import {
    asAdministrator,
    browseAnonymously,
    type Card,
    createCard,
    createCards,
    createCollection,
    deleteCollections,
    deleteObjects,
    type FileToUpload,
    findIds,
    graphql,
    images,
    login,
    type Session,
} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */

type CardFields = {
    name: string;
    expandedName: string;
    dating: string;
    addition: string;
    artists: {name: string}[];
    hasImage: boolean;
    fileSize: number;
};

async function getCard(session: Session, id: string): Promise<CardFields> {
    const data = await graphql<{card: CardFields}>(
        session,
        'query ($id: CardID!) { card(id: $id) { name expandedName dating addition artists { name } hasImage fileSize } }',
        {id},
    );

    return data.card;
}

async function openCard(page: Page, card: {id: string}): Promise<void> {
    await page.goto(`card/${card.id}`);
    await page.waitForLoadState('networkidle');
}

async function editCard(page: Page, card: {id: string}): Promise<void> {
    await openCard(page, card);
    await page.locator('button[mattooltip="Passer en mode édition"]').click();
}

async function saveCard(page: Page): Promise<void> {
    await page.locator('button[mattooltip="Enregistrer les modifications"]').click();
    await expect(page.getByText('Mis à jour')).toBeVisible();
}

/**
 * The editor of a rich text field, eg: "Titre"
 */
function richText(page: Page, label: string): Locator {
    return page
        .locator('app-card .rich-text', {has: page.locator('.label', {hasText: new RegExp(`^${label}$`)})})
        .locator('.ql-editor');
}

function cardImage(page: Page): Locator {
    return page.locator('app-card .image-container img.image');
}

/**
 * Drop a file on the card, like dragging it from the desktop
 */
async function dropFile(page: Page, file: FileToUpload): Promise<void> {
    const dataTransfer = await page.evaluateHandle(
        ({name, mimeType, data}) => {
            const bytes = Uint8Array.from(atob(data), character => character.charCodeAt(0));
            const transfer = new DataTransfer();
            transfer.items.add(new File([bytes], name, {type: mimeType}));

            return transfer;
        },
        {name: file.name, mimeType: file.mimeType, data: file.buffer.toString('base64')},
    );

    const zone = page.locator('app-card div.body[naturalfiledrop]');
    await zone.dispatchEvent('dragenter', {dataTransfer});
    await zone.dispatchEvent('dragover', {dataTransfer});
    await zone.dispatchEvent('drop', {dataTransfer});
}

/**
 * The IDs of the suggestions about the given card
 */
async function findChanges(session: Session, original: Card): Promise<string[]> {
    const data = await graphql<{changes: {items: {id: string}[]}}>(
        session,
        'query ($original: ID!) { changes(filter: {groups: [{conditions: [{original: {equal: {value: $original}}}]}]}) { items { id } } }',
        {original: original.id},
    );

    return data.changes.items.map(change => change.id);
}

/**
 * The tooltip currently shown, Angular Material does not give it the role "tooltip"
 */
function tooltip(page: Page): Locator {
    return page.locator('.mat-mdc-tooltip-show');
}

test('student can only remove a card from the collections they manage', async ({page, cleanup}) => {
    await login(page, 'student');

    // Card 6001 of the student is also in collection 2001, that the student does not manage
    const collection = await createCollection(page, 'E2E card');
    cleanup.add(() => deleteCollections(page, [collection.id]));
    await graphql(
        page,
        'mutation ($collection: CollectionID!) { linkCardCollection(card: 6001, collection: $collection) { id } }',
        {collection: collection.id},
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
});

test('student can export a card, and download its image', async ({page}) => {
    await login(page, 'student');
    await openCard(page, {id: '6005'});

    let download = page.waitForEvent('download');
    await page.locator('app-card app-export-menu button').click();
    await page.getByRole('menuitem', {name: 'Exporter la fiche'}).click();
    expect((await download).suggestedFilename()).toMatch(/\.zip$/);

    download = page.waitForEvent('download');
    await page.locator('a[mattooltip="Télécharger l\'image"]').click();
    expect(await (await download).failure()).toBeNull();
});

test('anonymous cannot export a card', async ({page}) => {
    await browseAnonymously(page);
    await page.goto('card/6005');

    // Make sure the card is shown, before checking that something is not
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Test related card 6005').first()).toBeVisible();

    await expect(page.locator('app-export-menu button')).toHaveCount(0);
});

test('administrator can fill the fields of a card with the keyboard', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const tag = crypto.randomUUID();
    const card = await createCard(page, {name: `E2E card ${tag}`});
    const artist = `E2E artist ${tag}`;
    cleanup.add(async () => {
        await deleteObjects(page, 'Card', [card.id]);
        await deleteObjects(page, 'Artist', await findIds(page, 'Artist', artist));
    });

    await editCard(page, card);

    // The title is a single line, so Enter does not add a line
    await richText(page, 'Titre').click();
    await page.keyboard.press('End');
    await page.keyboard.type(' edited');
    await page.keyboard.press('Enter');

    // Tab goes to the next field, instead of being typed in the title
    await page.keyboard.press('Tab');
    await expect(richText(page, 'Titre étendu')).toBeFocused();

    // The extended title has several lines
    await page.keyboard.type('First line');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Second line');

    await page.getByPlaceholder('Ajouter un artiste...').fill(artist);
    await page.getByPlaceholder('Ajouter un artiste...').press('Enter');
    await page.getByLabel('Datation').fill('1900');
    await saveCard(page);

    const saved = await getCard(page, card.id);
    expect(saved.name).toBe(`${card.name} edited`);
    expect(saved.expandedName).toBe('<p>First line</p><p>Second line</p>');
    expect(saved.dating).toBe('1900');
    expect(saved.artists).toEqual([{name: artist}]);
});

test('administrator sees all the fields of Dilps when editing a card', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const card = await createCard(page);
    cleanup.add(() => deleteObjects(page, 'Card', [card.id]));

    await editCard(page, card);
    const form = page.locator('app-card .left-pane');
    for (const label of [
        'Titre',
        'Titre étendu',
        'Artistes',
        'Auteur technique',
        'Supplément',
        'Datation',
        'Domaines',
        'Technique & Matériel',
        'Dimensions',
        'Lieu',
        'Institution',
        'Adresse',
        "Référence de l'image",
        'Source',
        "Droits d'auteur",
        'Fiches associées',
    ]) {
        await expect(form.getByText(label, {exact: true}).first(), label).toBeVisible();
    }

    // The address is collapsed while editing
    await form.getByRole('heading', {name: 'Adresse'}).click();
    for (const label of ['Rue', 'NPA', 'Localité']) {
        await expect(form.getByText(label, {exact: true}).first(), label).toBeVisible();
    }

    // Fields of Tiresias are not shown
    for (const label of ['Corpus', 'Matériaux', 'Mots clés', 'Nom antique', 'Périodes', 'URL']) {
        await expect(form.getByText(label, {exact: true}), label).toHaveCount(0);
    }
});

test('administrator sees the help of the fields while editing a card', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const card = await createCard(page);
    cleanup.add(() => deleteObjects(page, 'Card', [card.id]));

    await editCard(page, card);
    await page.getByLabel('Datation').hover();
    await expect(tooltip(page)).toContainText("Les siècles s'écrivent en chiffres romains");
});

test('administrator can type long words without widening the fields of a card', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const card = await createCard(page);
    cleanup.add(() => deleteObjects(page, 'Card', [card.id]));

    await editCard(page, card);
    const pane = page.locator('app-card .left-pane');
    const width = (await pane.boundingBox())!.width;

    await page.getByLabel('Datation').fill('x'.repeat(250));
    await page.getByLabel('Supplément').fill('y'.repeat(500));
    await richText(page, 'Source').fill('z'.repeat(500));

    expect((await pane.boundingBox())!.width).toBe(width);
    const scroll = page.locator('app-card .left-pane .scroll');
    expect(await scroll.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0);
});

test('administrator gets a wide enough scrollbar beside the fields of a card', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const card = await createCard(page);
    cleanup.add(() => deleteObjects(page, 'Card', [card.id]));

    // In edition, all fields are shown, so they overflow
    await editCard(page, card);
    const scroll = page.locator('app-card .left-pane .scroll');
    await expect.poll(() => scroll.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
    expect(
        await scroll.evaluate((element: HTMLElement) => element.offsetWidth - element.clientWidth),
    ).toBeGreaterThanOrEqual(15);
});

test('administrator sees the related cards by their title', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const tag = crypto.randomUUID();
    const card = await createCard(page);
    const related = await createCard(page, {name: `<p>E2E <strong>related</strong> ${tag}</p>`});
    cleanup.add(() => deleteObjects(page, 'Card', [card.id, related.id]));
    await graphql(
        page,
        'mutation ($card1: CardID!, $card2: CardID!) { linkCardCard(card1: $card1, card2: $card2) { id } }',
        {
            card1: card.id,
            card2: related.id,
        },
    );

    // Below the image, by their plain title
    await openCard(page, card);
    await page.locator(`app-related-cards a[href="/card/${related.id}"]`).hover();
    await expect(tooltip(page)).toHaveText(`E2E related ${tag}`);

    // In edition, by their plain title and ID
    await page.locator('button[mattooltip="Passer en mode édition"]').click();
    await expect(page.locator('natural-relations')).toContainText(`E2E related ${tag} (${related.id})`);
});

test('administrator can import the data of another card while editing a card', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const tag = crypto.randomUUID();
    const source = await createCard(page, {name: `E2E source ${tag}`, dating: '1900', addition: 'Imported'});
    const card = await createCard(page, {name: `E2E destination ${tag}`});
    cleanup.add(() => deleteObjects(page, 'Card', [source.id, card.id]));

    await editCard(page, card);
    await page.locator('button[mattooltip="Importer les données d\'une autre fiche"]').click();
    const dialog = page.getByRole('dialog');
    await dialog.locator('natural-select[placeholder="Sélectionnez une fiche"] input').fill(`source ${tag}`);
    await page.getByRole('option', {name: new RegExp(`E2E source ${tag}`)}).click();
    await dialog.getByRole('button', {name: 'Sélectionner'}).click();

    await expect(page.getByLabel('Datation')).toHaveValue('1900');
    await saveCard(page);

    // The data is copied into the edited card, and the other card is unchanged
    expect(await getCard(page, card.id)).toMatchObject({name: source.name, dating: '1900', addition: 'Imported'});
    expect(await getCard(page, source.id)).toMatchObject({name: source.name, dating: '1900', addition: 'Imported'});
});

for (const format of ['jpeg', 'tiff'] as const) {
    test(`administrator can replace the image of a card by dropping a ${format} file`, async ({page, cleanup}) => {
        await login(page, 'administrator');
        const card = await createCard(page);
        cleanup.add(() => deleteObjects(page, 'Card', [card.id]));
        const before = await getCard(page, card.id);

        await editCard(page, card);
        await dropFile(page, images[format]);

        // The browser cannot show a TIFF, so a placeholder is shown until saved
        if (format === 'tiff') {
            await expect(cardImage(page)).toHaveAttribute('src', /^data:image\/svg\+xml/);
            const placeholder = decodeURIComponent((await cardImage(page).getAttribute('src'))!);
            expect(placeholder).toContain('Aperçu non disponible');
        } else {
            await expect(cardImage(page)).toHaveAttribute('src', /^data:image\/jpeg/);
        }

        await saveCard(page);
        await expect(cardImage(page)).toHaveAttribute('src', new RegExp(`/api/image/${card.id}/`));
        await expect
            .poll(() => cardImage(page).evaluate((image: HTMLImageElement) => image.naturalWidth))
            .toBeGreaterThan(0);
        expect((await getCard(page, card.id)).fileSize).not.toBe(before.fileSize);
    });
}

test('administrator can delete a card from its detail', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const card = await createCard(page);
    cleanup.add(() => deleteObjects(page, 'Card', [card.id]));

    await openCard(page, card);
    await page.locator('button[mattooltip="Supprimer la fiche définitivement"]').click();
    await page.getByRole('dialog').getByRole('button', {name: 'Supprimer définitivement'}).click();
    await expect(page).toHaveURL(/\/home/);

    expect(await findIds(page, 'Card', card.name)).toEqual([]);
});

test('student can submit their own card to be added', async ({page, cleanup}) => {
    await login(page, 'student');
    const [card] = await createCards(page, cleanup, [`E2E suggestion ${crypto.randomUUID()}`]);

    await openCard(page, card);
    await page.locator('button[mattooltip="Soumettre"]').click();
    await expect(page).toHaveURL(/\/notification$/);
    await expect(page.locator('tr', {hasText: card.name})).toHaveCount(1);
});

for (const [action, suggestion] of [
    ['Suggérer une modification', 'an update'],
    ['Suggérer la suppression', 'the deletion'],
]) {
    test(`student can suggest ${suggestion} of a card of someone else`, async ({page, cleanup}) => {
        await login(page, 'student');

        // A new card, because the pending suggestion of deletion of a card is reused
        const original = await asAdministrator(page, admin =>
            createCard(admin, {name: `E2E original ${crypto.randomUUID()}`, visibility: 'Member'}),
        );
        cleanup.add(() =>
            asAdministrator(page, async admin => {
                // Rejecting deletes the copy of the card made for the suggestion
                for (const id of await findChanges(admin, original)) {
                    await graphql(admin, 'mutation ($id: ChangeID!) { rejectChange(id: $id) }', {id});
                }
                await deleteObjects(admin, 'Card', [original.id]);
            }),
        );

        await openCard(page, original);
        await page.locator('button[mattooltip="Soumettre"]').click();
        await page.getByRole('menuitem', {name: action}).click();

        if (action === 'Suggérer une modification') {
            // The suggestion is a copy of the card, edited beside the original
            await expect(page).toHaveURL(new RegExp(`/notification/new/${original.id}$`));
            await expect(page.locator('.card-original')).toBeVisible();
            // Files would go straight to the original card, and accepting a suggestion never applies them
            await expect(page.locator('app-files')).toHaveCount(0);
            await page.locator('.card-suggestion').getByLabel('Datation').fill('Suggested dating');
            await page.locator('button[mattooltip="Soumettre la suggestion à validation"]').click();
        }

        await expect(page).toHaveURL(/\/notification$/);
        await expect(page.locator('tr', {hasText: original.name})).toHaveCount(1);
        expect(await findChanges(page, original)).toHaveLength(1);
    });
}
