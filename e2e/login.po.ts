import { browser, by, element, ExpectedConditions } from 'protractor';

export class LoginPage {
    navigateTo() {
        return browser.get('/');
    }

    fillCredentials(credentials) {
        element(by.css('.mat-expansion-panel')).click();

        const login = element(by.css('[name="login"]'));
        browser.wait(ExpectedConditions.visibilityOf(login), 3000, 'login took too long to appear');
        login.sendKeys(credentials.username);
        const password = element(by.css('[name="password"]'));
        browser.wait(ExpectedConditions.visibilityOf(password), 3000, 'password took too long to appear');
        password.sendKeys(credentials.password);

        element(by.css('[type="submit"]')).click();
    }

    acceptLicense() {
        const modalButton = element(by.css('[ng-reflect-dialog-result="true"]'));
        browser.wait(ExpectedConditions.visibilityOf(modalButton), 3000, 'button took too long to appear');
        modalButton.click();
    }

    getParagraphText() {
        return element(by.css('app-root .login-info')).getText();
    }

    getErrorMessage() {
        const error = element(by.css('.mat-simple-snackbar'));
        browser.wait(ExpectedConditions.visibilityOf(error), 3000, 'error took too long to appear');
        return error.getText();
    }
}
