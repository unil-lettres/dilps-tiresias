import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {ArtistService} from '../services/artist.service';
import {Artist_artist} from '../../shared/generated-types';
import {ThesaurusDetailDialogExtraData} from 'client/app/shared/components';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
})
export class ArtistComponent extends AbstractDetailDirective<ArtistService, ThesaurusDetailDialogExtraData> {
    public constructor(
        service: ArtistService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<ArtistComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Artist_artist & ThesaurusDetailDialogExtraData},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }
}
