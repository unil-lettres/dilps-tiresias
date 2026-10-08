import {type Page} from '@playwright/test';
import {expect, test} from './fixtures';
import {deleteObjects, findIds, login, uniqueName} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */

/**
 * The thesauri of Dilps, with the words of their UI
 */
const thesauri = [
    {title: 'an artist', menu: 'Artistes', type: 'Artist', article: 'un artiste', item: "l'artiste"},
    {
        title: 'an institution',
        menu: 'Institutions',
        type: 'Institution',
        article: 'une institution',
        item: "l'institution",
    },
    {title: 'a domain', menu: 'Domaines', type: 'Domain', article: 'un domaine', item: 'le domaine'},
] as const;

async function searchList(page: Page, term: string): Promise<void> {
    const input = page.getByRole('textbox', {name: 'Rechercher', exact: true});
    await input.fill(term);
    await input.press('Enter');
    await page.waitForLoadState('networkidle');
}

for (const thesaurus of thesauri) {
    test(`administrator can create, search, edit and delete ${thesaurus.title}`, async ({page, cleanup}) => {
        await login(page, 'administrator');
        const tag = crypto.randomUUID();
        const name = uniqueName(`E2E ${thesaurus.menu} ${tag}`);
        const renamed = `${name} renamed`;
        cleanup.add(async () => {
            for (const any of [name, renamed]) {
                await deleteObjects(page, thesaurus.type, await findIds(page, thesaurus.type, any));
            }
        });

        await page.goto('home');
        await page.locator('button[mattooltip="Thésaurus"]').click();
        await page.getByRole('menuitem', {name: thesaurus.menu}).click();
        await expect(page.getByRole('heading', {name: thesaurus.menu})).toBeVisible();

        await page.getByRole('button', {name: `Créer ${thesaurus.article}`}).click();
        let dialog = page.getByRole('dialog', {name: `Créer ${thesaurus.article}`});
        await dialog.getByLabel('Nom', {exact: true}).fill(name);
        await dialog.getByRole('button', {name: 'Ajouter'}).click();
        await expect(dialog).toBeHidden();

        await searchList(page, tag);
        const rows = page.locator('table tr.editable-row');
        await expect(rows).toHaveCount(1);
        await expect(rows).toContainText(name);

        await rows.click();
        dialog = page.getByRole('dialog', {name: `Modifier ${thesaurus.item}`});
        await page.waitForLoadState('networkidle');
        await dialog.getByLabel('Nom', {exact: true}).fill(renamed);
        await dialog.getByRole('button', {name: 'Enregistrer'}).click();
        await expect(dialog).toBeHidden();
        await expect(rows).toContainText(renamed);

        await rows.click();
        await page.waitForLoadState('networkidle');
        await dialog.getByRole('button', {name: 'Supprimer'}).click();
        const confirm = page.getByRole('dialog').filter({hasText: `Supprimer ${thesaurus.item} « ${renamed} » ?`});
        await confirm.getByRole('button', {name: 'Supprimer définitivement'}).click();
        await expect(rows).toHaveCount(0);
        expect(await findIds(page, thesaurus.type, renamed)).toEqual([]);
    });
}
