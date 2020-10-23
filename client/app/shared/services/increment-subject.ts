import {Literal} from '@ecodev/natural';
import {merge} from 'lodash-es';
import {BehaviorSubject} from 'rxjs';

/**
 * Same as BehaviorSubject with same functions
 * Expose additional function patch() that prevents to override old value, bug merges new one in old one (for object variables usage)
 */
export class IncrementSubject<T = Literal> extends BehaviorSubject<T> {
    constructor(_val: T = {} as T) {
        super(_val);
    }

    public patch(value: T): void {
        this.next(merge({}, this.value, value));
    }
}
