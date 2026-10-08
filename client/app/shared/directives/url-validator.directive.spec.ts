import {FormControl} from '@angular/forms';
import {UrlValidatorDirective} from './url-validator.directive';

describe('UrlValidatorDirective', () => {
    const validator = new UrlValidatorDirective();

    function validate(value: string): ReturnType<UrlValidatorDirective['validate']> {
        return validator.validate(new FormControl(value));
    }

    it('accepts URLs', () => {
        expect(validate('https://example.com')).toBeNull();
        expect(validate('http://example.com/path?query=1#anchor')).toBeNull();
    });

    it('accepts an empty value, the field being optional', () => {
        expect(validate('')).toBeNull();
    });

    it('refuses what is not an URL', () => {
        expect(validate('example.com')).toEqual({url: {value: 'example.com'}});
        expect(validate('not an url')).toEqual({url: {value: 'not an url'}});
    });
});
