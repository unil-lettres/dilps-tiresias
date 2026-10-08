import {expect, test} from './fixtures';

test('anonymous sees how to log in', async ({page}) => {
    await page.goto('');
    await expect(page.locator('.login-info')).toHaveText("Veuillez choisir une méthode d'authentification");
});

test('anonymous sees an error with wrong credentials', async ({page, problems}) => {
    problems.allow(/Le nom d'utilisateur ou mot de passe est incorrect/);
    await page.goto('login');
    await page.waitForLoadState('networkidle');

    await page.getByText('Utilisateur·rice externe').click();
    await page.locator('input[name="login"]').fill('wrongname');
    await page.locator('input[name="password"]').fill('wrongpasswd');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('[matsnackbarlabel]')).toContainText(
        "Le nom d'utilisateur ou mot de passe est incorrect",
    );
    await expect(page).toHaveURL(/\/login/);
});
