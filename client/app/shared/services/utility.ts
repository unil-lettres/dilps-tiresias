import {Apollo} from 'apollo-angular';
import {defaultIfEmpty, forkJoin, map, Observable} from 'rxjs';

export function shuffleArray(a: any[]): any[] {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Load an image file and return a promise that resolves with a data URL
 * representing the image.
 *
 * If the image format is not supported by the browser, a placeholder data URL
 * is returned instead.
 *
 * @param file The image file to load.
 * @returns A promise that resolves with a data URL representing the image,
 * or a placeholder data URL if the image format is not supported.
 */
export function loadImageAsDataUrl(file: File | null): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('There is no file'));
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', (ev: any) => {
            const dataUrl = ev.target.result;

            // Test if browser can decode this image format
            const img = new Image();
            img.onload = () => {
                // Image successfully decoded
                resolve(dataUrl);
            };
            img.onerror = () => {
                // Browser cannot decode this format, return placeholder
                const placeholder = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                        <rect width="400" height="300" fill="#f5f5f5"/>
                        <text x="200" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#666">
                            Aperçu non disponible
                        </text>
                        <text x="200" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#999">
                            L'image sera visible après enregistrement
                        </text>
                    </svg>
                `)}`;
                resolve(placeholder);
            };
            img.src = dataUrl;
        });
        reader.readAsDataURL(file);
    });
}

export function formatYearRange(from: number | null, to: number | null): string {
    if (from !== null && to !== null) {
        return ` (entre ${from} et ${to})`;
    }

    if (from !== null) {
        return ` (${from})`;
    }

    if (to !== null) {
        return ` (${to})`;
    }

    return '';
}

/**
 * Return the name of the item followed by its root parent name in parenthesis.
 *
 * If the item is a root item, then only its name is returned.
 */
export function formatItemNameWithRoot(item: {name: string; hierarchicName: string}): string {
    if (item.hierarchicName == item.name) {
        return item.name;
    }
    const parents = item.hierarchicName
        .split('>')
        .map((parent: string) => parent.trim())
        .filter((parent: string) => parent.length > 0);

    const strParents = parents.slice(0, parents.length - 1).join(' > ');
    return `${parents[parents.length - 1]} (${strParents})`;
}

/**
 * Return an observable that will emit the given result after all the queries
 * currently in the Apollo stack have been resolved.
 *
 * @param apollo the Apollo instance.
 * @param result the result to emit.
 * @returns an observable that will emit the given result after all the queries
 * currently in the Apollo stack have been resolved.
 */
export function waitOnApolloQueries<T>(apollo: Apollo, result: T): Observable<T> {
    const observableQueries = apollo.client.getObservableQueries();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const promises = Array.from(observableQueries.values()).map(q => q.result());
    return forkJoin(promises).pipe(
        map(() => result),
        defaultIfEmpty(result),
    );
}
