import {OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {merge} from 'lodash';
import {ArtistComponent} from '../../artists/artist/artist.component';
import {UserService} from '../../users/services/user.service';
import {AlertService} from './alert/alert.service';

export class AbstractDetail implements OnInit {
    public user;

    public data: any = {
        item: {},
    };

    constructor(
        public service,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<ArtistComponent>,
        public userService: UserService,
        data: any,
    ) {
        this.data = merge({item: this.service.getConsolidatedForClient()}, data);
    }

    public ngOnInit(): void {
        if (this.data.item.id) {
            this.service.getOne(this.data.item.id).subscribe(res => {
                merge(this.data.item, res); // init all fields considering getOne query
                this.postQuery();
            });
        }

        this.userService.getCurrentUser().subscribe(user => (this.user = user));
    }

    public update(): void {
        this.service.updateNow(this.data.item).subscribe(model => {
            this.alertService.info('Mis à jour');
            this.dialogRef.close(this.data.item);
            this.postUpdate(model);
        });
    }

    public create(): void {
        this.service.create(this.data.item).subscribe(() => {
            this.alertService.info('Créé');
            this.dialogRef.close(this.data.item);
        });
    }

    public delete(): void {
        this.alertService
            .confirm('Suppression', 'Voulez-vous supprimer définitivement cet élément ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.service.delete([this.data.item]).subscribe(() => {
                        this.alertService.info('Supprimé');
                        this.dialogRef.close(null);
                    });
                }
            });
    }

    protected postQuery(): void {}

    protected postUpdate(model): void {}
}
