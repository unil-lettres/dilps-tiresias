import {Component, Inject} from '@angular/core';
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {AbstractDetailDirective} from '../../shared/components/AbstractDetail';
import {AlertService} from '../../shared/components/alert/alert.service';
import {UserService} from '../../users/services/user.service';
import {ArtistService} from '../services/artist.service';
import {Artist_artist} from '../../shared/generated-types';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
})
export class ArtistComponent extends AbstractDetailDirective<ArtistService> {
    public constructor(
        service: ArtistService,
        alertService: AlertService,
        userService: UserService,
        dialogRef: MatDialogRef<ArtistComponent>,
        @Inject(MAT_DIALOG_DATA) data: undefined | {item: Artist_artist},
    ) {
        super(service, alertService, dialogRef, userService, data);
    }
}
