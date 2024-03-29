import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {getBase64Url} from '../../shared/services/utility';
import {UserService} from '../../users/services/user.service';
import {NewsService} from '../services/news.service';
import {Newses, NewsInput} from '../../shared/generated-types';
import {DialogFooterComponent} from '../../shared/components/dialog-footer/dialog-footer.component';
import {CommonModule} from '@angular/common';
import {UrlValidatorDirective} from '../../shared/directives/url-validator.directive';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss',
    standalone: true,
    imports: [
        MatDialogModule,
        MatTabsModule,
        FlexModule,
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

    public constructor(
        service: NewsService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<NewsComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Newses['newses']['items'][0]},
    ) {
        super(service, alertService, dialogRef, userService, data);
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
