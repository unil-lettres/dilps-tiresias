import {inject, Service} from '@angular/core';
import {shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Service()
export class MapApiService {
    private readonly httpClient = inject(HttpClient);

    public readonly loaded = this.httpClient
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        .jsonp('https://maps.googleapis.com/maps/api/js?libraries=places&key=' + environment.agmApiKey, 'callback')
        .pipe(
            map(() => true),
            shareReplay(),
        );
}
