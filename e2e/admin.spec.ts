import {type Locator, type Page} from '@playwright/test';
import {expect, test} from './fixtures';
import {deleteObjects, findIds, getViewer, graphql, images, login, loginAs, uniqueName} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */

async function openAdministration(page: Page, menu: string): Promise<void> {
    await page.goto('home');
    await page.locator('button[mattooltip="Gestion"]').click();
    await page.getByRole('menuitem', {name: menu}).click();
    await page.waitForLoadState('networkidle');
}

async function searchList(page: Page, term: string): Promise<Locator> {
    const input = page.getByRole('textbox', {name: 'Rechercher', exact: true});
    await input.fill(term);
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    return page.locator('table tr.editable-row');
}

/**
 * Click a row of a list to open its dialog, and wait for it to be reloaded, otherwise the reload would overwrite what
 * we type
 */
async function openRow(page: Page, row: Locator, title: string): Promise<Locator> {
    await row.click();
    await page.waitForLoadState('networkidle');

    return page.getByRole('dialog', {name: title});
}

async function confirmDeletion(page: Page, title: string): Promise<void> {
    await page
        .getByRole('dialog')
        .filter({hasText: title})
        .getByRole('button', {name: 'Supprimer définitivement'})
        .click();
}

test('administrator can create a user, edit and delete them', async ({page, cleanup}) => {
    await login(page, 'administrator');
    const name = `e2e-${crypto.randomUUID()}`;
    cleanup.add(async () => deleteObjects(page, 'User', await findIds(page, 'User', name)));

    await openAdministration(page, 'Utilisateurs');
    await page.getByRole('button', {name: 'Créer un utilisateur'}).click();
    let dialog = page.getByRole('dialog', {name: 'Créer un utilisateur'});
    await dialog.getByLabel('Login').fill(name);
    await dialog.getByLabel('Nom', {exact: true}).fill('E2E user');
    await dialog.getByLabel('Email').fill(`${name}@example.com`);
    await dialog.getByLabel('Mot de passe', {exact: true}).fill(name);
    await dialog.getByLabel('Confirmation du mot passe').fill(name);
    await expect(dialog.getByRole('combobox', {name: 'Rôle'})).toContainText('Étudiant·e');
    await dialog.getByRole('button', {name: 'Ajouter'}).click();
    await expect(dialog).toBeHidden();

    const rows = await searchList(page, name);
    await expect(rows).toHaveCount(1);
    dialog = await openRow(page, rows, `Modifier l'utilisateur « ${name} »`);
    await dialog.getByLabel('Nom', {exact: true}).fill('E2E user renamed');
    await dialog.getByRole('button', {name: 'Enregistrer'}).click();
    await expect(dialog).toBeHidden();
    await expect(rows).toContainText('E2E user renamed');

    dialog = await openRow(page, rows, `Modifier l'utilisateur « ${name} »`);
    await dialog.getByRole('button', {name: 'Supprimer'}).click();
    await confirmDeletion(page, 'Cette action est irréversible');
    await expect(rows).toHaveCount(0);
    expect(await findIds(page, 'User', name)).toEqual([]);
});

// Known bug: a user cannot be deleted once they logged in, because the log of their login references them, and the
// server answers "Internal server error". The same goes for any other object that they created. A fixed login is used,
// so that at most one such user is left behind until fixed. Remove `test.fail()` once fixed.
test('administrator can delete a user who logged in', async ({page, browser, cleanup}) => {
    test.fail();
    await login(page, 'administrator');
    const name = 'e2e-logged-in';
    cleanup.add(async () => deleteObjects(page, 'User', await findIds(page, 'User', name)));

    if (!(await findIds(page, 'User', name)).length) {
        const viewer = await getViewer(page);
        await graphql(page, 'mutation ($input: UserInput!) { createUser(input: $input) { id } }', {
            input: {login: name, name, email: `${name}@example.com`, password: name, site: viewer.site},
        });
    }

    const user = await browser.newPage();
    try {
        await loginAs(user, name, name);
    } finally {
        await user.close();
    }

    await openAdministration(page, 'Utilisateurs');
    const rows = await searchList(page, name);
    await expect(rows).toHaveCount(1);
    const dialog = await openRow(page, rows, `Modifier l'utilisateur « ${name} »`);
    await dialog.getByRole('button', {name: 'Supprimer'}).click();
    await confirmDeletion(page, 'Cette action est irréversible');
    await expect(rows).toHaveCount(0);
});

// Known bug: the roles available are only loaded when editing a user, so they are all disabled when creating one, and
// only students can be created. Remove `test.fail()` once fixed.
test('administrator can choose the role of a new user', async ({page}) => {
    test.fail();
    await login(page, 'administrator');
    await openAdministration(page, 'Utilisateurs');
    await page.getByRole('button', {name: 'Créer un utilisateur'}).click();
    const dialog = page.getByRole('dialog', {name: 'Créer un utilisateur'});
    await dialog.getByRole('combobox', {name: 'Rôle'}).click();
    await expect(page.getByRole('option', {name: 'Senior'})).toBeEnabled({timeout: 2_000});
});

/**
 * Whether the browser can show the image of the given URL
 */
async function canShowImage(page: Page, url: string): Promise<boolean> {
    return page.evaluate(
        src =>
            new Promise<boolean>(resolve => {
                const image = new Image();
                image.onload = () => resolve(image.naturalWidth > 0);
                image.onerror = () => resolve(false);
                image.src = src;
            }),
        url,
    );
}

for (const format of ['jpeg', 'tiff'] as const) {
    test(`administrator can create a news with a ${format} image, edit and delete it`, async ({page, cleanup}) => {
        await login(page, 'administrator');
        const name = uniqueName('E2E news');
        const renamed = `${name} renamed`;
        cleanup.add(async () => {
            for (const any of [name, renamed]) {
                await deleteObjects(page, 'News', await findIds(page, 'News', any));
            }
        });

        await openAdministration(page, 'Actualités');
        await page.getByRole('button', {name: 'Créer une actualité'}).click();
        let dialog = page.getByRole('dialog', {name: 'Créer une actualité'});
        await dialog.getByRole('checkbox', {name: /^Actif/}).check();
        await dialog.getByLabel('Nom').fill(name);
        await dialog.getByLabel('Description').fill('E2E description');
        await dialog.getByLabel('Lien').fill('https://example.com');

        const fileChooser = page.waitForEvent('filechooser');
        await dialog.getByRole('button', {name: 'Joindre une image'}).click();
        await (await fileChooser).setFiles(images[format]);

        // The browser cannot show a TIFF, so a placeholder is shown until saved
        const preview = dialog.locator('img.image');
        if (format === 'tiff') {
            await expect(preview).toHaveAttribute('src', /^data:image\/svg\+xml/);
            expect(decodeURIComponent((await preview.getAttribute('src'))!)).toContain('Aperçu non disponible');
        } else {
            await expect(preview).toHaveAttribute('src', /^data:image\/jpeg/);
        }

        await dialog.getByRole('button', {name: 'Ajouter'}).click();
        await expect(dialog).toBeHidden();

        const rows = await searchList(page, name);
        await expect(rows).toHaveCount(1);

        // Once saved, the image is given by the server, in a format that browsers can show
        const url = await rows.locator('.image').evaluate(element => getComputedStyle(element).backgroundImage);
        expect(await canShowImage(page, url.replace(/^url\("(.*)"\)$/, '$1'))).toBe(true);

        dialog = await openRow(page, rows, "Modifier l'actualité");
        await dialog.getByLabel('Nom').fill(renamed);
        await dialog.getByRole('button', {name: 'Enregistrer'}).click();
        await expect(dialog).toBeHidden();
        await expect(rows).toContainText(renamed);

        dialog = await openRow(page, rows, "Modifier l'actualité");
        await dialog.getByRole('button', {name: 'Supprimer'}).click();
        await confirmDeletion(page, 'Supprimer cette actualité ?');
        await expect(rows).toHaveCount(0);
    });
}

test('administrator can see the statistics of visits, cards and users', async ({page}) => {
    await login(page, 'administrator');
    await openAdministration(page, 'Statistiques');

    for (const tab of ['Fréquentation', 'Fiches', 'Utilisateurs']) {
        await page.getByRole('tab', {name: tab}).click();
        await page.waitForLoadState('networkidle');
        const panel = page.getByRole('tabpanel');
        await expect(panel.locator('highcharts-chart svg.highcharts-root')).toBeVisible();
        await expect(panel.locator('table[mat-table]').first()).toBeVisible();
    }
});
