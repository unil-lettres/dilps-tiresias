import {PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './e2e/',
    outputDir: __dirname + '/logs/tests/e2e/',
    use: {
        baseURL: process.env.E2E_BASE_URL ?? 'http://dilps.lan:4400/',
        headless: true,
        viewport: {width: 1280, height: 720},
        ignoreHTTPSErrors: true,
        screenshot: 'on',
        video: {
            mode: 'on',
            size: {
                width: 1280,
                height: 720,
            },
        },
    },
};

export default config;
