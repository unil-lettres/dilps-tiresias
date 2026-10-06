import {expect, test} from './fixtures';
import {getViewer, graphql, login} from './helpers';

test('student can update their profile, but not their email nor the end of their access', async ({page}) => {
    await login(page, 'student');
    const viewer = await getViewer(page);

    try {
        await page.locator('button[mattooltip="Mon compte"]').click();
        await page.getByRole('menuitem', {name: /Modifier mon compte/}).click();
        const dialog = page.getByRole('dialog');

        // Wait for the profile to be reloaded, otherwise it would overwrite what we type
        await expect(dialog.locator('input[name="login"]')).toHaveValue('student');
        await page.waitForLoadState('networkidle');

        await expect(dialog.locator('input[name="email"]')).toBeDisabled();
        await expect(dialog.locator('input[name="activeUntil"]')).toBeDisabled();

        // Saving sends the whole profile, with the administrative fields unchanged, and must not fail
        const name = `E2E student ${Date.now()}`;
        await dialog.locator('input[name="name"]').fill(name);
        await dialog.getByRole('button', {name: /Enregistrer/}).click();

        await expect.poll(async () => (await getViewer(page)).name).toBe(name);
    } finally {
        await graphql(
            page,
            'mutation ($id: UserID!, $name: String!) { updateUser(id: $id, input: {name: $name}) { id } }',
            {
                id: viewer.id,
                name: viewer.name,
            },
        );
    }
});
