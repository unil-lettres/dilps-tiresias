import { isString, uniq } from 'lodash';
import { Card } from '../shared/generated-types';

export interface Result {
    name: boolean;
    artists: boolean;
    institution: boolean;
    dating: boolean;
}

export function test(formValue: string, card: Card['card']): Result {
    const commonPlaces = /(eglise|chapelle|musee)/g;
    const words = sanitize(formValue).replace(commonPlaces, '').split(/\W/).filter(word => word.length > 3);

    const result = {
        name: false,
        artists: false,
        institution: false,
        dating: false,
    };

    for (const attribute of Object.keys(result)) {
        const value = card[attribute];
        if (attribute === 'institution') {
            result[attribute] = testSingleThesaurus(words, value);
        } else if (attribute === 'artists') {
            result[attribute] = testMultipleThesaurus(words, value);
        } else if (attribute === 'dating') {
            result[attribute] = testString(words, value) || testDate(formValue, card.datings);
        } else if (isString(value)) {
            result[attribute] = testString(words, value);
        }
    }

    return result;
}

function sanitize(string: string): string {
    return stripVowelAccent(string.toLowerCase());
}

function testString(words: string[], attributeValue: string): boolean {
    attributeValue = sanitize(attributeValue);
    for (const word of words) {
        if (attributeValue.indexOf(word) > -1) {
            return true;
        }
    }

    return false;
}

function testSingleThesaurus(words: string[], attributeValue): boolean {
    if (!attributeValue) {
        return false;
    }

    return testString(words, attributeValue.name);
}

function testMultipleThesaurus(words: string[], attributeValue): boolean {
    for (const item of attributeValue) {
        if (testSingleThesaurus(words, item)) {
            return true;
        }
    }

    return false;
}

function testDate(formValue: string, datings: Card['card']['datings']): boolean {

    const years: string[] = uniq(formValue.match(/(-?\d+)/));
    if (years) {
        for (const year of years) {
            const searched = (new Date(year)).getFullYear();
            for (const dating of datings) {
                const from = (new Date(dating.from)).getFullYear();
                const to = (new Date(dating.to)).getFullYear();

                // If expected span is small, then allow a margin of error
                const span = to - from;
                let margin;
                if (span === 0) {
                    margin = 25;
                } else if (span < 20) {
                    margin = 15;
                } else {
                    margin = 0;
                }

                if (searched >= from - margin && searched <= to + margin) {
                    return true;
                }
            }
        }
    }

    return false;
}

function stripVowelAccent(str: string): string {

    const rExps = [
        {
            re: /[\xC0-\xC6]/g,
            ch: 'A',
        },
        {
            re: /[\xE0-\xE6]/g,
            ch: 'a',
        },
        {
            re: /[\xC8-\xCB]/g,
            ch: 'E',
        },
        {
            re: /[\xE8-\xEB]/g,
            ch: 'e',
        },
        {
            re: /[\xCC-\xCF]/g,
            ch: 'I',
        },
        {
            re: /[\xEC-\xEF]/g,
            ch: 'i',
        },
        {
            re: /[\xD2-\xD6]/g,
            ch: 'O',
        },
        {
            re: /[\xF2-\xF6]/g,
            ch: 'o',
        },
        {
            re: /[\xD9-\xDC]/g,
            ch: 'U',
        },
        {
            re: /[\xF9-\xFC]/g,
            ch: 'u',
        },
        {
            re: /[\xD1]/g,
            ch: 'N',
        },
        {
            re: /[\xF1]/g,
            ch: 'n',
        },
    ];

    for (let i = 0, len = rExps.length; i < len; i++) {
        str = str.replace(rExps[i].re, rExps[i].ch);
    }

    return str;
}
