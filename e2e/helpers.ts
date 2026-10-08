import {type APIRequestContext, type Locator, type Page, request} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {type Cleanup, expect} from './fixtures';

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
 * Where to send GraphQL requests from: a page, with the session of its user, or an API context, eg: of an administrator
 */
export type Session = Page | APIRequestContext;

export type Card = {
    id: string;
    name: string;
};

/**
 * The objects that tests create, and must delete after themselves
 */
type Deletable = 'Artist' | 'Card' | 'Collection' | 'Domain' | 'Institution' | 'News' | 'User';

export type FileToUpload = {
    name: string;
    mimeType: string;
    buffer: Buffer;
};

/**
 * The image of the cards created by tests, which is the one of the test data
 */
const cardImage: FileToUpload = {
    name: 'image.jpg',
    mimeType: 'image/jpeg',
    buffer: readFileSync(join(__dirname, '../data/images/dw4jV3zYSPsqE2CB8BcP8ABD0.jpg')),
};

/**
 * Other images to upload, eg: to replace the image of a card
 */
export const images: Record<'jpeg' | 'tiff', FileToUpload> = {
    jpeg: {
        name: 'image.jpg',
        mimeType: 'image/jpeg',
        buffer: readFileSync(join(__dirname, 'files/image.jpg')),
    },
    tiff: {
        name: 'image.tiff',
        mimeType: 'image/tiff',
        buffer: readFileSync(join(__dirname, 'files/image.tiff')),
    },
};

/**
 * Log in via the login form, and accept the terms of use if never accepted yet
 */
export async function login(page: Page, role: Role): Promise<void> {
    await loginAs(page, role, role);
}

/**
 * Log in via the login form with any user, and accept the terms of use if never accepted yet
 */
export async function loginAs(page: Page, login: string, password: string): Promise<void> {
    await page.goto('login');

    // Like a human typing, let the login page load first, otherwise logging in resets the Apollo store while queries
    // are in flight, and Apollo logs an error about it
    await page.waitForLoadState('networkidle');

    await page.getByText('Utilisateur·rice externe').click();
    await page.locator('input[name="login"]').fill(login);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();

    // Users who never accepted the terms of use must accept them before being redirected
    const accept = page.getByRole('button', {name: 'Accepter'});
    const loggedIn = (): boolean => !new URL(page.url()).pathname.startsWith('/login');
    await expect.poll(async () => loggedIn() || (await accept.isVisible()), {timeout: 30_000}).toBe(true);
    if (!loggedIn()) {
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

async function parseResult<T>(response: {json: () => Promise<unknown>}): Promise<T> {
    const body = (await response.json()) as {data: T; errors?: unknown};
    expect(body.errors).toBeUndefined();

    return body.data;
}

function requestOf(session: Session): APIRequestContext {
    return 'request' in session ? session.request : session;
}

/**
 * Send a GraphQL request with the given session, to prepare or clean up data, and fail on any error
 */
export async function graphql<T>(session: Session, query: string, variables: Record<string, unknown> = {}): Promise<T> {
    return parseResult<T>(await requestOf(session).post('graphql', {data: {query, variables}}));
}

export async function getViewer(session: Session): Promise<Viewer> {
    const data = await graphql<{viewer: Viewer}>(session, '{ viewer { id name site } }');

    return data.viewer;
}

/**
 * Run the callback with a separate session of the given role, eg: to prepare data owned by someone else
 */
export async function asUser<T>(
    page: Page,
    role: Role,
    callback: (session: APIRequestContext) => Promise<T>,
): Promise<T> {
    const session = await request.newContext({baseURL: new URL('/', page.url()).href});
    try {
        await graphql(
            session,
            'mutation ($login: Login!, $password: String!) { login(login: $login, password: $password) { id } }',
            {login: role, password: role},
        );

        return await callback(session);
    } finally {
        await session.dispose();
    }
}

/**
 * Run the callback with a separate session of the administrator, eg: to delete what other roles cannot delete
 */
export async function asAdministrator<T>(page: Page, callback: (admin: APIRequestContext) => Promise<T>): Promise<T> {
    return asUser(page, 'administrator', callback);
}

/**
 * A name that no other test, even running in parallel, can use
 */
export function uniqueName(prefix: string): string {
    return `${prefix} ${crypto.randomUUID()}`;
}

/**
 * Create a card owned by the current user, with an image, so that it is listed like the cards created via the UI
 */
export async function createCard(session: Session, input: Record<string, unknown> = {}): Promise<Card> {
    const viewer = await getViewer(session);
    const response = await requestOf(session).post('graphql', {
        multipart: {
            operations: JSON.stringify({
                query: 'mutation ($input: CardInput!) { createCard(input: $input) { id name } }',
                variables: {input: {name: uniqueName('E2E card'), site: viewer.site, ...input, file: null}},
            }),
            map: JSON.stringify({0: ['variables.input.file']}),
            0: cardImage,
        },
    });

    const data = await parseResult<{createCard: Card}>(response);

    return data.createCard;
}

/**
 * Create cards of the given names, that the administrator deletes after the test, because not every role can
 */
export async function createCards(page: Page, cleanup: Cleanup, names: string[]): Promise<Card[]> {
    const cards: Card[] = [];
    for (const name of names) {
        cards.push(await createCard(page, {name}));
    }

    cleanup.add(() =>
        asAdministrator(page, admin =>
            deleteObjects(
                admin,
                'Card',
                cards.map(card => card.id),
            ),
        ),
    );

    return cards;
}

/**
 * Create a collection owned by the current user, with a unique name
 */
export async function createCollection(
    session: Session,
    prefix: string,
    input: Record<string, unknown> = {},
): Promise<{id: string; name: string}> {
    const viewer = await getViewer(session);
    const name = uniqueName(prefix);
    const data = await graphql<{createCollection: {id: string; name: string}}>(
        session,
        'mutation ($input: CollectionInput!) { createCollection(input: $input) { id name } }',
        {input: {name, site: viewer.site, ...input}},
    );

    return data.createCollection;
}

/**
 * Find the collections of the given name
 */
export async function findCollections(
    session: Session,
    name: string,
): Promise<{id: string; parent: {id: string} | null}[]> {
    const data = await graphql<{collections: {items: {id: string; parent: {id: string} | null}[]}}>(
        session,
        'query ($name: String!) { collections(filter: {groups: [{conditions: [{name: {equal: {value: $name}}}]}]}) { items { id parent { id } } } }',
        {name},
    );

    return data.collections.items;
}

function plural(type: Deletable): string {
    return type === 'News' ? 'Newses' : type + 's';
}

/**
 * The name of the query listing objects of the given type, eg: `newses`
 */
function listQuery(type: Deletable): string {
    return plural(type).charAt(0).toLowerCase() + plural(type).slice(1);
}

/**
 * Find the IDs of the objects of the given name, eg: to delete what a test created via the UI
 */
export async function findIds(session: Session, type: Deletable, name: string): Promise<string[]> {
    const field = type === 'User' ? 'login' : 'name';
    const query = listQuery(type);
    const data = await graphql<Record<string, {items: {id: string}[]}>>(
        session,
        `query ($name: String!) { ${query}(filter: {groups: [{conditions: [{${field}: {equal: {value: $name}}}]}]}) { items { id } } }`,
        {name},
    );

    return data[query].items.map(item => item.id);
}

/**
 * Delete objects, and thus their dependents, eg: the sub-collections of collections
 *
 * Objects already deleted, eg: by the test itself, are ignored.
 */
export async function deleteObjects(session: Session, type: Deletable, ids: string[]): Promise<void> {
    if (!ids.length) {
        return;
    }

    const query = listQuery(type);
    const data = await graphql<Record<string, {items: {id: string}[]}>>(
        session,
        `query ($ids: [ID!]!) { ${query}(filter: {groups: [{conditions: [{id: {in: {values: $ids}}}]}]}) { items { id } } }`,
        {ids},
    );
    const existing = data[query].items.map(item => item.id);

    if (existing.length) {
        await graphql(session, `mutation ($ids: [${type}ID!]!) { delete${plural(type)}(ids: $ids) }`, {ids: existing});
    }
}

/**
 * Delete collections, and thus all their sub-collections
 */
export async function deleteCollections(session: Session, ids: string[]): Promise<void> {
    await deleteObjects(session, 'Collection', ids);
}

/**
 * Show only the cards of the given search on the home page, by opening its URL, like a link to a search
 */
export async function openSearch(page: Page, term: string): Promise<void> {
    const selections = [[{f: 'search', c: {like: {value: term}}}]];
    await page.goto('home;ns=' + encodeURIComponent(JSON.stringify(JSON.stringify(selections))));
    await page.waitForLoadState('networkidle');
    await expect(page.locator('natural-search natural-input', {hasText: term})).toHaveCount(1);
}

/**
 * The input to type a new search term
 */
export function searchInput(page: Page): Locator {
    return page.getByRole('textbox', {name: 'Rechercher', exact: true});
}

/**
 * Search the cards, each term being typed separately, and its results awaited, like a human would do
 */
export async function search(page: Page, ...terms: string[]): Promise<void> {
    for (const term of terms) {
        await searchInput(page).fill(term);
        await searchInput(page).press('Enter');
        await page.waitForLoadState('networkidle');
    }
}

export async function clearSearch(page: Page): Promise<void> {
    await page.locator('natural-search button[mattooltip="Annuler la recherche"]').click();
    await page.waitForLoadState('networkidle');
}

/**
 * The titles of the cards shown in the gallery, in order
 */
export function galleryTitles(page: Page): Locator {
    return page.locator('natural-gallery figcaption');
}

/**
 * Check the titles of the cards shown in the gallery, in any order, because cards created in the same second have no
 * defined order
 */
export async function expectGalleryTitles(page: Page, names: string[]): Promise<void> {
    await expect.poll(async () => (await galleryTitles(page).allInnerTexts()).sort()).toEqual([...names].sort());
}

/**
 * The card of the given name in the gallery
 */
export function galleryItem(page: Page, name: string): Locator {
    return page.locator('natural-gallery figure', {has: page.locator('figcaption', {hasText: name})});
}

export function selectButton(page: Page, name: string): Locator {
    return galleryItem(page, name).getByRole('checkbox', {name: 'Select'});
}

/**
 * Select cards of the gallery with the keyboard, because Playwright scrolls their button under the sticky toolbar
 * before clicking
 */
export async function selectCards(page: Page, cards: Card[]): Promise<void> {
    for (const card of cards) {
        await selectButton(page, card.name).press('Enter');
        await expect(selectButton(page, card.name)).toHaveAttribute('aria-checked', 'true');
    }
}

/**
 * Click an action of the toolbar of the gallery, which is either a button, or an item of the overflow menu when the
 * toolbar is too narrow, eg: because of a selection or of the search terms
 */
export async function galleryAction(page: Page, label: string): Promise<void> {
    // The icon buttons have no accessible name, only a tooltip
    const button = page.locator(`app-list mat-toolbar button[mattooltip="${label}"]`);
    const overflow = page.getByRole('button', {name: 'Options de la galerie'});
    await clickButtonOrMenuItem(page, button, overflow, label);
}

/**
 * Click an action on the selected cards, which is either a button, or an item of the overflow menu when the toolbar
 * is too narrow
 */
export async function selectionAction(page: Page, tooltip: string, menuItem: string): Promise<void> {
    const button = page.locator(`app-list .background-selection button[mattooltip="${tooltip}"]`);
    const overflow = page.locator('app-list .background-selection button[mattooltip="Actions sur la sélection"]');
    await clickButtonOrMenuItem(page, button, overflow, menuItem);
}

/**
 * Open the export menu of the selection, from the toolbar, or from its overflow menu when it is too narrow
 */
export async function openExportMenu(page: Page): Promise<void> {
    const button = page.locator('app-list .background-selection app-export-menu button');
    const overflow = page.locator('app-list .background-selection button[mattooltip="Actions sur la sélection"]');
    await clickButtonOrMenuItem(page, button, overflow, 'Exporter');
}

async function clickButtonOrMenuItem(page: Page, button: Locator, overflow: Locator, menuItem: string): Promise<void> {
    // The toolbar measures itself after rendering, so a button may move into the overflow menu right after a selection
    let inOverflow = false;
    await expect(async () => {
        inOverflow = !(await button.isVisible());
        await (inOverflow ? overflow : button).click({timeout: 1_000});
    }).toPass();

    if (inOverflow) {
        await page.getByRole('menuitem', {name: menuItem}).click();
    }
}
