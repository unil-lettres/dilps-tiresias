/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */

import {DataSource} from '@angular/cdk/collections';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

export class BasicDataSource extends DataSource<any> {
    constructor(private data: Observable<any> | any) {
        super();
    }

    connect(): Observable<any> {
        if (this.data instanceof Observable) {
            return this.data.pipe(
                map(data => {
                    return data.items ? data.items : data;
                }),
            );
        } else {
            return of(this.data.items ? this.data.items : this.data);
        }
    }

    disconnect() {}
}
