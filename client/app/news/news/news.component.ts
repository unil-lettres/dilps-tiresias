import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {getBase64Url} from '../../shared/services/utility';
import {NewsService} from '../services/news.service';
import {NewsInput} from '../../shared/generated-types';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {CommonModule} from '@angular/common';
import {UrlValidatorDirective} from '../../shared/directives/url-validator.directive';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss',
    standalone: true,
    imports: [
        MatDialogModule,
        MatTabsModule,
        MatCheckboxModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        UrlValidatorDirective,
        CommonModule,
        DialogFooterComponent,
    ],
})
export class NewsComponent extends AbstractDetailDirective<NewsService, {file?: File; imageUrl: string}> {
    public imageData: string | null = null;

    public constructor() {
        const service = inject(NewsService);

        super(service);
    }

    public upload(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const file = target.files![0];
        (this.data.item as unknown as NewsInput).file = file;
        getBase64Url(file).then(result => {
            this.imageData = result;
        });
    }
}
