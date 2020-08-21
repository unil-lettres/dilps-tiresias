import {browser, by, element} from 'protractor';

export class AppPage {
    public navigateTo(): Promise<void> {
        return browser.get('/') as Promise<void>;
    }

    public getParagraphText(): Promise<unknown> {
        return element(by.css('app-root .login-info')).getText() as Promise<string>;
    }
}
