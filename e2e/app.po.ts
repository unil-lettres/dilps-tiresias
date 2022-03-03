import {Page, Response} from '@playwright/test';

export class AppPage {
    public constructor(private readonly page: Page) {}

    public navigateTo(): Promise<null | Response> {
        return this.page.goto('');
    }

    public getParagraphText(): Promise<unknown> {
        return this.page.innerText('app-root .login-info');
    }
}
