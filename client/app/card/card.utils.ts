/**
 * The maximum length of the code of a card, as stored by the server
 */
export const codeMaxLength = 30;

/**
 * The code suggested for a card in a single collection, made of the name of the collection and the ID of the card, like
 * the server does when adding a card to a collection
 *
 * The ID makes the code unique, so the name is shortened to fit.
 */
export function suggestCode(collectionName: string, id: string): string {
    const suffix = '-' + id;

    return collectionName.slice(0, codeMaxLength - suffix.length).trimEnd() + suffix;
}
