import { merge } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Literal } from '../types';

/**
 * Same as BehaviorSubject with same functions
 * Expose additional function patch() that prevents to override old value, bug merges new one in old one (for object variables usage)
 */
export class IncrementSubject<T = Literal> extends BehaviorSubject<T> {

    constructor(_val: T = {} as T) {
        super(_val);
    }

    public patch(value: T) {
        this.next(merge({}, this.value, value));
    }
}
