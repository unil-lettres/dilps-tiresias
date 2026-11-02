import {expect, test} from './fixtures';
import {
    createCards,
    expectGalleryTitles,
    galleryAction,
    galleryItem,
    galleryTitles,
    login,
    openSearch,
    search,
    searchInput,
    selectButton,
    selectCards,
} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */

test('student can open a card from the gallery, directly or from the zoomed image', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [card] = await createCards(page, cleanup, [`E2E gallery ${tag}`]);
    await openSearch(page, tag);

    await galleryItem(page, card.name).getByRole('button', {name: 'activate item'}).click();
    await expect(page).toHaveURL(new RegExp(`/card/${card.id}$`));
    await expect(page.locator('app-card .ql-editor').first()).toHaveText(card.name);

    // The search is kept when coming back
    await page.goBack();
    await expect(galleryTitles(page)).toHaveText([card.name]);

    await galleryItem(page, card.name).getByRole('button', {name: 'zoom'}).click();
    await expect(page.locator('.pswp').getByRole('img', {name: card.name})).toBeVisible();
    await page.locator('.pswp').getByRole('button', {name: 'Voir la fiche'}).click();
    await expect(page).toHaveURL(new RegExp(`/card/${card.id}$`));
    await expect(page.locator('.pswp')).toHaveCount(0);
});

test('student can sort the gallery by title', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [b, c, a] = await createCards(page, cleanup, [`E2E ${tag} B`, `E2E ${tag} C`, `E2E ${tag} A`]);
    await openSearch(page, tag);
    await expectGalleryTitles(page, [a.name, b.name, c.name]);

    await galleryAction(page, 'Trier');
    await page.getByRole('menuitem', {name: 'Titre'}).click();
    await expect(galleryTitles(page)).toHaveText([a.name, b.name, c.name]);
});

test('student can hide the titles of the gallery until hovered, and show them again', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [card] = await createCards(page, cleanup, [`E2E gallery ${tag}`]);
    await openSearch(page, tag);
    const title = galleryItem(page, card.name).locator('figcaption');
    await expect(title).not.toHaveClass(/hover/);

    // The tooltip of this button changes, so it is found by its icon
    await page.locator('app-list button:has(mat-icon[data-mat-icon-name="font_download_off"])').click();
    await expect(title).toHaveClass(/hover/);

    // The choice is kept for the session
    await page.reload();
    await expect(galleryItem(page, card.name).locator('figcaption')).toHaveClass(/hover/);

    await page.locator('app-list button:has(mat-icon[data-mat-icon-name="font_download"])').click();
    await expect(galleryItem(page, card.name).locator('figcaption')).not.toHaveClass(/hover/);
});

test('student can select some or all loaded cards, and unselect them all', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [first, second, third] = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`, `E2E ${tag} 3`]);
    await openSearch(page, tag);
    const counter = page.locator('app-list .background-selection');

    await selectCards(page, [first]);
    await expect(counter).toContainText('1 fiche sélectionnée');
    await selectCards(page, [second]);
    await expect(counter).toContainText('2 fiches sélectionnées');

    await galleryAction(page, 'Annuler la sélection');
    await expect(counter).toHaveCount(0);
    await expect(selectButton(page, first.name)).toHaveAttribute('aria-checked', 'false');

    // Out of the selection mode, the shortcut keeps its usual meaning
    await page.keyboard.press('ControlOrMeta+a');
    await expect(counter).toHaveCount(0);

    await galleryAction(page, 'Sélectionner des images');
    await expect(counter).toContainText('Cliquez ou glissez sur les images');
    await page.keyboard.press('ControlOrMeta+a');
    await expect(counter).toContainText('3 fiches sélectionnées');
    for (const card of [first, second, third]) {
        await expect(selectButton(page, card.name)).toHaveAttribute('aria-checked', 'true');
    }
});

test('the shortcut to select all cards leaves the search input alone', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [first] = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    await openSearch(page, tag);
    await selectCards(page, [first]);

    await searchInput(page).press('ControlOrMeta+a');
    await expect(page.locator('app-list .background-selection')).toContainText('1 fiche sélectionnée');
});

test('a search unselects all the cards', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [kept, other] = await createCards(page, cleanup, [`E2E ${tag} kept`, `E2E ${tag} other`]);
    await openSearch(page, tag);
    await selectCards(page, [kept, other]);

    await search(page, 'kept');
    await expectGalleryTitles(page, [kept.name]);
    await expect(page.locator('app-list .background-selection')).toHaveCount(0);
    await expect(selectButton(page, kept.name)).toHaveAttribute('aria-checked', 'false');
});

test('a sort unselects all the cards', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [first, second] = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    await openSearch(page, tag);
    await selectCards(page, [first]);

    await galleryAction(page, 'Trier');
    await page.getByRole('menuitem', {name: 'Titre'}).click();
    await expectGalleryTitles(page, [first.name, second.name]);
    await expect(page.locator('app-list .background-selection')).toHaveCount(0);
    await expect(selectButton(page, first.name)).toHaveAttribute('aria-checked', 'false');
});

test('switching between the mosaic and the list unselects all the cards', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [first, second] = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    await openSearch(page, tag);
    const counter = page.locator('app-list .background-selection');
    await selectCards(page, [first]);

    await galleryAction(page, 'Affichage Liste');
    const titles = page.locator('app-view-list article .title');
    await expect(titles).toHaveCount(2);
    await expect(counter).toHaveCount(0);

    await page.locator('app-view-list article mat-checkbox').first().click();
    await expect(counter).toContainText('1 fiche sélectionnée');

    await galleryAction(page, 'Affichage Mosaïque');
    await expectGalleryTitles(page, [first.name, second.name]);
    await expect(counter).toHaveCount(0);
});

test('changing page in the list view unselects all the cards', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    await createCards(
        page,
        cleanup,
        [1, 2, 3, 4, 5, 6].map(i => `E2E ${tag} ${i}`),
    );
    await openSearch(page, tag);
    await galleryAction(page, 'Affichage Liste');
    const paginator = page.locator('app-view-list mat-paginator').first();
    await paginator.getByRole('combobox').press('Enter');
    await page.getByRole('option', {name: '5', exact: true}).click();
    const cards = page.locator('app-view-list article');
    await expect(cards).toHaveCount(5);

    await cards.first().locator('mat-checkbox').click();
    const counter = page.locator('app-list .background-selection');
    await expect(counter).toContainText('1 fiche sélectionnée');

    await paginator.getByRole('button', {name: /next page|page suivante/i}).press('Enter');
    await expect(cards).toHaveCount(1);
    await expect(counter).toHaveCount(0);
});

test('student can select all the cards of the page in the list view', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    await openSearch(page, tag);
    await galleryAction(page, 'Affichage Liste');
    await expect(page.locator('app-view-list article .title')).toHaveCount(2);

    await galleryAction(page, 'Sélectionner les images visibles');
    await expect(page.locator('app-list .background-selection')).toContainText('2 fiches sélectionnées');
});

test('student can switch to the list view and back to the mosaic', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [first, second] = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    await openSearch(page, tag);

    await galleryAction(page, 'Affichage Liste');
    const titles = page.locator('app-view-list article .title');
    await expect.poll(async () => (await titles.allInnerTexts()).sort()).toEqual([first.name, second.name]);
    await expect(page.locator('natural-gallery')).toHaveCount(0);

    await galleryAction(page, 'Affichage Mosaïque');
    await expectGalleryTitles(page, [first.name, second.name]);
});

test('student can read the selected cards, or a number of random cards', async ({page, cleanup}) => {
    await login(page, 'student');
    const tag = crypto.randomUUID();
    const [first, second] = await createCards(page, cleanup, [`E2E ${tag} 1`, `E2E ${tag} 2`]);
    await openSearch(page, tag);

    await selectCards(page, [first, second]);
    await galleryAction(page, "Lecture d'oeuvre");
    await expect(page).toHaveURL(/\/quizz;cards=/);
    await expect(page.getByText('Image 1 / 2')).toBeVisible();
    await page.getByRole('button', {name: 'Suivant'}).click();
    await expect(page.getByText('Image 2 / 2')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Recommencer'})).toBeVisible();

    // Without selection, random cards of the current search are read
    await openSearch(page, tag);
    await galleryAction(page, "Lecture d'oeuvre");
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Nombre de fiches').fill('1');
    await dialog.getByRole('button', {name: "Lancer la lecture d'oeuvre"}).click();
    await expect(page.getByText('Image 1 / 1')).toBeVisible();
});
