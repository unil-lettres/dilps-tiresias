import {inject, Injectable} from '@angular/core';
import {shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MapApiService {
    private readonly httpClient = inject(HttpClient);

    public readonly loaded = this.httpClient
        .jsonp('https://maps.googleapis.com/maps/api/js?libraries=places&key=' + environment.agmApiKey, 'callback')
        .pipe(
            map(() => true),
            shareReplay(),
        );
}
