import {Injectable} from '@angular/core';
import {Observable, shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MapApiService {
    public readonly loaded: Observable<boolean>;

    public constructor(httpClient: HttpClient) {
        this.loaded = httpClient
            .jsonp('https://maps.googleapis.com/maps/api/js?libraries=places&key=' + environment.agmApiKey, 'callback')
            .pipe(
                map(() => true),
                shareReplay(),
            );
    }
}
