import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SafeStyle} from '@angular/platform-browser';
import {AbstractDetail} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {getBase64} from '../../shared/services/utility';
import {UserService} from '../../users/services/user.service';
import {NewsService} from '../services/news.service';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
})
export class NewsComponent extends AbstractDetail {
    public imageData: SafeStyle;

    constructor(
        service: NewsService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<NewsComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
    ) {
        super(service, alertService, dialogRef, userService, data);
    }

    public upload(file): void {
        this.data.item.file = file;
        getBase64(file).then(result => {
            this.imageData = result;
        });
    }
}
