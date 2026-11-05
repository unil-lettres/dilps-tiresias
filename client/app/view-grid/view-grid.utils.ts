/**
 * Make the spaces of French typography non-breaking, so that a punctuation mark is never alone at the start of a line.
 *
 * Only existing spaces are replaced: before `;`, `!`, `?`, `:` and `»`, and after `«`. Tags are removed, except line
 * breaks, as the gallery would do anyway.
 */
export function nonBreakingFrenchSpaces(html: string): string {
    return html
        .replace(/<(?!\s*br\s*\/?)[^>]*>/gi, '')
        .replace(/ +(?=[;!?:»])/g, '\u00a0')
        .replace(/« +/g, '«\u00a0');
}
