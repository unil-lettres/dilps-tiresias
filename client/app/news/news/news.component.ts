import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {getBase64Url} from '../../shared/services/utility';
import {UserService} from '../../users/services/user.service';
import {NewsService} from '../services/news.service';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
})
export class NewsComponent extends AbstractDetailDirective<NewsService> {
    public imageData: string;

    public constructor(
        service: NewsService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<NewsComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
    ) {
        super(service, alertService, dialogRef, userService, data);
    }

    public upload(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const file = target.files[0];
        this.data.item.file = file;
        getBase64Url(file).then(result => {
            this.imageData = result;
        });
    }
}
