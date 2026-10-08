import {type Page} from '@playwright/test';
import {expect, test} from './fixtures';
import {asUser, createCollection, deleteCollections, getViewer, graphql, login, uniqueName} from './helpers';

/**
 * Requires the test data of the Dilps site, see `tests/data/`
 */

async function openAccountMenu(page: Page, item: RegExp): Promise<void> {
    await page.locator('button[mattooltip="Mon compte"]').click();
    await page.getByRole('menuitem', {name: item}).click();
}

test('student can update their profile, but not their email nor the end of their access', async ({page, cleanup}) => {
    await login(page, 'student');
    const viewer = await getViewer(page);
    cleanup.add(() =>
        graphql(page, 'mutation ($id: UserID!, $name: String!) { updateUser(id: $id, input: {name: $name}) { id } }', {
            id: viewer.id,
            name: viewer.name,
        }),
    );

    await openAccountMenu(page, /Modifier mon compte/);
    const dialog = page.getByRole('dialog');

    // Wait for the profile to be reloaded, otherwise it would overwrite what we type
    await expect(dialog.locator('input[name="login"]')).toHaveValue('student');
    await page.waitForLoadState('networkidle');

    await expect(dialog.locator('input[name="email"]')).toBeDisabled();
    await expect(dialog.locator('input[name="activeUntil"]')).toBeDisabled();

    // Saving sends the whole profile, with the administrative fields unchanged, and must not fail
    const name = uniqueName('E2E student');
    await dialog.locator('input[name="name"]').fill(name);
    await dialog.getByRole('button', {name: /Enregistrer/}).click();

    await expect.poll(async () => (await getViewer(page)).name).toBe(name);
});

test('student can see the collections they are subscribed to, and unsubscribe', async ({page, cleanup}) => {
    await login(page, 'student');
    const student = await getViewer(page);

    // A private collection of someone else, that the student only sees as a reader
    const collection = await asUser(page, 'junior', async junior => {
        const created = await createCollection(junior, 'E2E subscribed');
        await graphql(
            junior,
            'mutation ($collection: CollectionID!, $subscriber: UserID!) { linkCollectionSubscriber(collection: $collection, subscriber: $subscriber) { id } }',
            {collection: created.id, subscriber: student.id},
        );

        return created;
    });
    cleanup.add(() => asUser(page, 'junior', junior => deleteCollections(junior, [collection.id])));

    await openAccountMenu(page, /Gérer mes abonnements/);
    const dialog = page.getByRole('dialog', {name: 'Vos abonnements aux collections'});
    const item = dialog.locator('mat-list-item', {hasText: collection.name});
    await expect(item).toHaveCount(1);

    await item.getByRole('button', {name: 'Se désabonner'}).click();
    const confirm = page
        .getByRole('dialog')
        .filter({hasText: `Se désabonner de la collection « ${collection.name} » ?`});
    await confirm.getByRole('button', {name: 'Me désabonner'}).click();
    await expect(item).toHaveCount(0);

    // Not being a reader anymore, the student cannot see the collection anymore
    await page.goto('my-collection');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(collection.name)).toHaveCount(0);
});

test('student can log out', async ({page}) => {
    await login(page, 'student');

    // Otherwise the images still loading would be refused, once logged out
    await page.waitForLoadState('networkidle');
    await openAccountMenu(page, /Se déconnecter/);
    await expect(page).toHaveURL(/\/login/);

    // Being logged out, the pages that require to log in are not accessible anymore
    await page.goto('my-collection');
    await expect(page).toHaveURL(/\/login/);
});

test('student can switch to the dark theme and back, and the choice is kept', async ({page}) => {
    await login(page, 'student');
    const html = page.locator('html');
    const background = (): Promise<string> =>
        page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor);

    await page.locator('natural-compact-color-schemer button').click();
    await page.getByRole('menuitem', {name: 'Thème sombre'}).click();
    await expect(html).toHaveAttribute('data-is-dark', 'true');
    const dark = await background();

    await page.reload();
    await expect(html).toHaveAttribute('data-is-dark', 'true');

    await page.locator('natural-compact-color-schemer button').click();
    await page.getByRole('menuitem', {name: 'Thème clair'}).click();
    await expect(html).toHaveAttribute('data-is-dark', 'false');
    expect(await background()).not.toBe(dark);
});
