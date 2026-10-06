import {type Page} from '@playwright/test';
import {expect} from './fixtures';

/**
 * The test users of `tests/data/users.sql`, whose password is their login
 */
export type Role = 'student' | 'junior' | 'senior' | 'major' | 'administrator';

export type Viewer = {
    id: string;
    name: string;
    site: string;
};

/**
 * Log in via the login form, and accept the terms of use if never accepted yet
 */
export async function login(page: Page, role: Role): Promise<void> {
    await page.goto('login');

    // Like a human typing, let the login page load first, otherwise logging in resets the Apollo store while queries
    // are in flight, and Apollo logs an error about it
    await page.waitForLoadState('networkidle');

    await page.getByText('Utilisateur·rice externe').click();
    await page.locator('input[name="login"]').fill(role);
    await page.locator('input[name="password"]').fill(role);
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('networkidle');

    const accept = page.getByRole('button', {name: 'Accepter'});
    if (await accept.isVisible()) {
        await accept.click();
    }

    await page.waitForURL(url => !url.pathname.startsWith('/login'));
}

/**
 * Browse as anonymous, like the "Accès public" button does
 */
export async function browseAnonymously(page: Page): Promise<void> {
    await page.addInitScript(() => sessionStorage.setItem('tempAccess', 'true'));
}

/**
 * Send a GraphQL request with the session of the page, to prepare or clean up data, and fail on any error
 */
export async function graphql<T>(page: Page, query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const response = await page.request.post('graphql', {data: {query, variables}});
    const body = (await response.json()) as {data: T; errors?: unknown};
    expect(body.errors).toBeUndefined();

    return body.data;
}

export async function getViewer(page: Page): Promise<Viewer> {
    const data = await graphql<{viewer: Viewer}>(page, '{ viewer { id name site } }');

    return data.viewer;
}

/**
 * A name that no other test, even running in parallel, can use
 */
export function uniqueName(prefix: string): string {
    return `${prefix} ${crypto.randomUUID()}`;
}

/**
 * Create a collection owned by the current user, with a unique name
 */
export async function createCollection(page: Page, prefix: string): Promise<{id: string; name: string}> {
    const viewer = await getViewer(page);
    const name = uniqueName(prefix);
    const data = await graphql<{createCollection: {id: string; name: string}}>(
        page,
        'mutation ($input: CollectionInput!) { createCollection(input: $input) { id name } }',
        {input: {name, site: viewer.site}},
    );

    return data.createCollection;
}

/**
 * Find the collections of the given name
 */
export async function findCollections(page: Page, name: string): Promise<{id: string; parent: {id: string} | null}[]> {
    const data = await graphql<{collections: {items: {id: string; parent: {id: string} | null}[]}}>(
        page,
        'query ($name: String!) { collections(filter: {groups: [{conditions: [{name: {equal: {value: $name}}}]}]}) { items { id parent { id } } } }',
        {name},
    );

    return data.collections.items;
}

/**
 * Delete collections, and thus all their sub-collections
 */
export async function deleteCollections(page: Page, ids: string[]): Promise<void> {
    if (ids.length) {
        await graphql(page, 'mutation ($ids: [CollectionID!]!) { deleteCollections(ids: $ids) }', {ids});
    }
}
