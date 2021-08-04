import {Page, Response} from '@playwright/test';

export class LoginPage {
    constructor(private readonly page: Page) {}

    public navigateTo(): Promise<null | Response> {
        return this.page.goto('/');
    }

    public async fillCredentials(username: string, password: string): Promise<unknown> {
        await this.page.click('.mat-expansion-panel');

        await this.page.type('[name="login"]', username);
        await this.page.type('[name="password"]', password);

        return this.page.click('[type="submit"]');
    }

    public acceptLicense(): Promise<void> {
        return this.page.click('[ng-reflect-dialog-result="true"]');
    }

    public getParagraphText(): Promise<string> {
        return this.page.innerText('app-root .login-info');
    }

    public getErrorMessage(): Promise<string> {
        return this.page.innerText('.mat-simple-snackbar');
    }
}
