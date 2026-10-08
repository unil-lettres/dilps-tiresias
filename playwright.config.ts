import {PlaywrightTestConfig} from '@playwright/test';

const dilps = process.env.E2E_BASE_URL ?? 'http://dilps.lan:4400/';

// Both sites are served by the same app, under another domain, eg: dilps.docker and tiresias.docker
const tiresias = process.env.E2E_TIRESIAS_BASE_URL ?? dilps.replace('dilps', 'tiresias');

const config: PlaywrightTestConfig = {
    testDir: './e2e/',
    outputDir: __dirname + '/logs/tests/e2e/',
    retries: 2,
    use: {
        headless: true,
        // Show scrollbars like real browsers do, because their width matters, eg: to catch an horizontal scroll
        launchOptions: {ignoreDefaultArgs: ['--hide-scrollbars']},
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
        trace: 'on-all-retries',
    },
    projects: [
        {name: 'dilps', testIgnore: 'tiresias.spec.ts', use: {baseURL: dilps}},
        // Also run the specs that are about both sites
        {name: 'tiresias', testMatch: ['tiresias.spec.ts', 'dialogs.spec.ts'], use: {baseURL: tiresias}},
    ],
};

export default config;
