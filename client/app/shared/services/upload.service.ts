import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UploadService {

    public readonly filesChanged = new Subject<File[]>();

    constructor() {

    }

}
