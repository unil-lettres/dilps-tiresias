import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../shared/components/alert/alert.service';
import { UserService } from '../../users/services/user.service';
import { NewsService } from '../services/news.service';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
})
export class NewsComponent extends AbstractDetail {

    constructor(service: NewsService,
                alertService: AlertService,
                userService: UserService,
                dialogRef: MatDialogRef<NewsComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        super(service, alertService, dialogRef, userService, data);
    }
}
