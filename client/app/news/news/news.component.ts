import {Component, inject} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {loadImageAsDataUrl} from '../../shared/services/utility';
import {NewsService} from '../services/news.service';
import {NewsInput} from '../../shared/generated-types';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';

import {UrlValidatorDirective} from '../../shared/directives/url-validator.directive';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FileSelection, NaturalFileSelectDirective} from '@ecodev/natural';

@Component({
    selector: 'app-news',
    imports: [
        MatDialogModule,
        MatCheckbox,
        FormsModule,
        MatFormField,
        MatLabel,
        MatError,
        MatHint,
        MatInput,
        UrlValidatorDirective,
        DialogFooterComponent,
        MatButton,
        MatIcon,
        NaturalFileSelectDirective,
    ],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss',
})
export class NewsComponent extends AbstractDetailDirective<NewsService, {file?: File; imageUrl: string}> {
    protected imageData: string | null = null;

    public constructor() {
        super(inject(NewsService));
    }

    protected upload(selection: FileSelection): void {
        selection.valid.forEach(file => {
            (this.data.item as unknown as NewsInput).file = file;
            loadImageAsDataUrl(file).then(result => {
                this.imageData = result;
            });
        });
    }

    protected override getTitleDeleteMessage(): string {
        return `Supprimer cette actualité ?`;
    }
}
