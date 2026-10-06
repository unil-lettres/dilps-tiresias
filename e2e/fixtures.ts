import {expect, test as base} from '@playwright/test';

type Cleanup = {
    /**
     * Run the callback after the test, even if it failed or timed out, eg: to delete the data it created
     */
    add: (callback: () => Promise<unknown>) => void;
};

type Problems = {
    /**
     * Allow problems matching the pattern, for a test that expects them, eg: a denied action
     */
    allow: (pattern: RegExp) => void;
};

/**
 * Fail any test whose page logs an error, throws, or receives a GraphQL error
 *
 * Those errors are often silent for the user: a list is empty instead of showing the expected items, or a button
 * does nothing. So they must be caught even if the test does not look for them.
 */
export const test = base.extend<{problems: Problems; cleanup: Cleanup}>({
    // Depends on the page, so that the page is still open during the cleanup
    cleanup: async ({page: _page}, use) => {
        const callbacks: (() => Promise<unknown>)[] = [];
        await use({add: callback => callbacks.push(callback)});

        for (const callback of callbacks.reverse()) {
            await callback();
        }
    },

    problems: [
        async ({page}, use) => {
            const problems: string[] = [];
            const allowed: RegExp[] = [];
            const pending: Promise<void>[] = [];

            page.on('console', message => {
                if (message.type() === 'error') {
                    problems.push('Console error: ' + message.text());
                }
            });

            page.on('pageerror', error => problems.push('Uncaught error: ' + error.message));

            page.on('response', response => {
                if (!new URL(response.url()).pathname.endsWith('/graphql')) {
                    return;
                }

                pending.push(
                    (async () => {
                        if (!response.ok()) {
                            problems.push('GraphQL HTTP error: ' + response.status());
                            return;
                        }

                        // Queries may be batched, so the body is either a result, or a list of results
                        const body: unknown = await response.json().catch(() => null);
                        for (const result of [body].flat() as ({errors?: {message: string}[]} | null)[]) {
                            for (const error of result?.errors ?? []) {
                                problems.push('GraphQL error: ' + error.message);
                            }
                        }
                    })(),
                );
            });

            await use({allow: pattern => allowed.push(pattern)});

            // A response body may never come, eg: after the page navigated away, so do not wait forever
            await Promise.race([Promise.all(pending), new Promise(resolve => setTimeout(resolve, 5_000))]);
            expect(problems.filter(problem => !allowed.some(pattern => pattern.test(problem)))).toEqual([]);
        },
        {auto: true},
    ],
});

export {expect};
