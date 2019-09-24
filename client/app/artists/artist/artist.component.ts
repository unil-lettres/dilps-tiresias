import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../shared/components/alert/alert.service';
import { UserService } from '../../users/services/user.service';
import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
})
export class ArtistComponent extends AbstractDetail {

    constructor(service: ArtistService,
                alertSvc: AlertService,
                userSvc: UserService,
                dialogRef: MatDialogRef<ArtistComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        super(service, alertSvc, dialogRef, userSvc, data);
    }
}
