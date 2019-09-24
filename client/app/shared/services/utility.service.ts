import { isEmpty } from 'lodash';
import { Literal } from '../types';

export class UtilityService {

    /**
     * Remove from source object the attributes with same value as modified
     * Does not consider arrays
     */
    public static cleanSameValues(source: Literal, modified: Literal): Literal {
        Object.keys(source).forEach(key => {
            if (source[key] instanceof Object) {
                this.cleanSameValues(source[key], modified[key]);
                if (isEmpty(source[key])) {
                    delete source[key];
                }
            } else if (modified && source[key] === modified[key]) {
                delete source[key];
            }
        });

        return source;
    }

    /**
     * Returns the plural form of the given name
     */
    public static makePlural(name: string): string {
        const plural = name + 's';

        return plural.replace(/ys$/, 'ies').replace(/ss$/, 'ses');
    }

    /**
     * Returns the string with the first letter as capital
     */
    public static upperCaseFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Returns the string with the first letter as lower case
     */
    public static lowerCaseFirstLetter(string: string): string {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }

    public static shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}
