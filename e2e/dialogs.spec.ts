import {type Locator, type Page} from '@playwright/test';
import {expect, test} from './fixtures';
import {graphql, login, type Role} from './helpers';

/**
 * Run on both sites, see playwright.config.ts. Requires the test data of both sites, see `tests/data/`
 *
 * The lists and their dialogs must offer exactly the actions that the server accepts from the user, otherwise the
 * user would be offered a dialog without any button to use it, or a button that fails.
 */

type Site = 'Dilps' | 'Tiresias';

type Permission =
    | 'artist'
    | 'institution'
    | 'domain'
    | 'period'
    | 'material'
    | 'antiqueName'
    | 'documentType'
    | 'tag'
    | 'news'
    | 'user';

type List = {
    path: string;
    permission: Permission;

    /**
     * The list query, eg: `newses`
     */
    query: string;

    /**
     * The label of the creation button, which is also the title of the creation dialog
     */
    create: string;
    update: string;
    details: string;

    /**
     * An object of the test data, per site where the list is used
     */
    items: Partial<Record<Site, string>>;

    /**
     * The field by which the object is found, `name` by default
     */
    field?: string;
    adminOnly?: boolean;
};

const lists: List[] = [
    {
        path: 'artist',
        permission: 'artist',
        query: 'artists',
        create: 'Créer un artiste',
        update: "Modifier l'artiste",
        details: "Détails de l'artiste",
        items: {Dilps: 'Test artist 3000'},
    },
    {
        path: 'institution',
        permission: 'institution',
        query: 'institutions',
        create: 'Créer une institution',
        update: "Modifier l'institution",
        details: "Détails de l'institution",
        items: {Dilps: 'Test institution 5000', Tiresias: 'Test institution 5001'},
    },
    {
        path: 'domain',
        permission: 'domain',
        query: 'domains',
        create: 'Créer un domaine',
        update: 'Modifier le domaine',
        details: 'Détails du domaine',
        items: {Dilps: 'Test domain 9002', Tiresias: 'Test domain 9000'},
    },
    {
        path: 'period',
        permission: 'period',
        query: 'periods',
        create: 'Créer une période',
        update: 'Modifier la période',
        details: 'Détails de la période',
        items: {Tiresias: 'Test root period 7000'},
    },
    {
        path: 'material',
        permission: 'material',
        query: 'materials',
        create: 'Créer un matériau',
        update: 'Modifier le matériau',
        details: 'Détails du matériau',
        items: {Tiresias: 'Test root material 8000'},
    },
    {
        path: 'antique-name',
        permission: 'antiqueName',
        query: 'antiqueNames',
        create: 'Créer un nom antique',
        update: 'Modifier le nom antique',
        details: 'Détails du nom antique',
        items: {Tiresias: 'Test antique name 12000'},
    },
    {
        path: 'document-type',
        permission: 'documentType',
        query: 'documentTypes',
        create: 'Créer un type de document',
        update: 'Modifier le type de document',
        details: 'Détails du type de document',
        items: {Tiresias: 'Test document type 11000'},
    },
    {
        path: 'tag',
        permission: 'tag',
        query: 'tags',
        create: 'Créer un mot-clé',
        update: 'Modifier le mot-clé',
        details: 'Détails du mot-clé',
        items: {Tiresias: 'Test root tag 4002'},
    },
    {
        path: 'news',
        permission: 'news',
        query: 'newses',
        create: 'Créer une actualité',
        update: "Modifier l'actualité",
        details: "Détails de l'actualité",
        items: {Dilps: 'Test news 10002', Tiresias: 'Test news 10000'},
        adminOnly: true,
    },
    {
        path: 'user',
        permission: 'user',
        query: 'users',
        create: 'Créer un utilisateur',
        update: "Modifier l'utilisateur « student »",
        details: "Détails de l'utilisateur « student »",
        items: {Dilps: 'student', Tiresias: 'student'},
        field: 'login',
        adminOnly: true,
    },
];

type Viewer = {
    site: Site;
    globalPermissions: Record<Permission, {create: boolean}>;
};

async function getViewer(page: Page): Promise<Viewer> {
    const permissions = [...new Set(lists.map(list => list.permission))].map(name => `${name} { create }`);
    const data = await graphql<{viewer: Viewer}>(
        page,
        `{ viewer { site globalPermissions { ${permissions.join(' ')} } } }`,
    );

    return data.viewer;
}

/**
 * The permissions of the object of the given name, on the current site, because some names exist on both sites
 */
async function getPermissions(
    page: Page,
    list: List,
    name: string,
    site: Site,
): Promise<{update: boolean; delete: boolean}> {
    const field = list.field ?? 'name';
    const data = await graphql<Record<string, {items: {permissions: {update: boolean; delete: boolean}}[]}>>(
        page,
        `query ($name: String!, $site: Site!) { ${list.query}(filter: {groups: [{conditions: [{${field}: {equal: {value: $name}}, site: {equal: {value: $site}}}]}]}) { items { permissions { update delete } } } }`,
        {name, site},
    );

    const [item] = data[list.query].items;
    expect(item, `${name} of the test data`).toBeDefined();

    return item.permissions;
}

/**
 * Check that the dialog offers exactly the given buttons
 */
async function expectButtons(dialog: Locator, expected: string[]): Promise<void> {
    const actions = dialog.locator('mat-dialog-actions');
    for (const label of ['Annuler', 'Fermer', 'Ajouter', 'Enregistrer', 'Supprimer']) {
        await expect(actions.getByRole('button', {name: label}), label).toHaveCount(expected.includes(label) ? 1 : 0);
    }
}

async function checkList(page: Page, list: List, viewer: Viewer, name: string): Promise<void> {
    await page.goto(list.path);
    const input = page.getByRole('textbox', {name: 'Rechercher', exact: true});
    await input.fill(name);
    await input.press('Enter');
    const row = page.locator('table tr.editable-row', {hasText: name}).first();
    await expect(row).toBeVisible();

    // Only who can create is offered to create
    const canCreate = viewer.globalPermissions[list.permission].create;
    const createButton = page.getByRole('button', {name: list.create, exact: true});
    await expect(createButton, list.create).toHaveCount(canCreate ? 1 : 0);

    if (canCreate) {
        await createButton.click();
        const dialog = page.getByRole('dialog', {name: list.create});
        await expect(dialog).toBeVisible();
        await expectButtons(dialog, ['Annuler', 'Ajouter']);
        await dialog.getByRole('button', {name: 'Annuler'}).click();
        await expect(dialog).toBeHidden();
    }

    // An existing object is offered to be modified only if allowed, otherwise only to be seen. The title only
    // changes once the object is reloaded in the dialog
    const permissions = await getPermissions(page, list, name, viewer.site);
    await row.click();
    const dialog = page.getByRole('dialog', {name: permissions.update ? list.update : list.details});
    await expect(dialog).toBeVisible();
    await page.waitForLoadState('networkidle');

    const close = permissions.update ? 'Annuler' : 'Fermer';
    await expectButtons(dialog, [
        close,
        ...(permissions.update ? ['Enregistrer'] : []),
        ...(permissions.delete ? ['Supprimer'] : []),
    ]);
    await dialog.getByRole('button', {name: close}).click();
    await expect(dialog).toBeHidden();
}

// Checking all lists of a site takes a while
test.describe.configure({timeout: 120_000});

for (const role of ['student', 'junior', 'senior', 'major', 'administrator'] satisfies Role[]) {
    test(`${role} is offered the dialogs and buttons that match their rights`, async ({page}) => {
        await login(page, role);
        const viewer = await getViewer(page);

        for (const list of lists) {
            const name = list.items[viewer.site];
            if (!name || (list.adminOnly && role !== 'administrator')) {
                continue;
            }

            await test.step(list.path, () => checkList(page, list, viewer, name));
        }
    });
}
