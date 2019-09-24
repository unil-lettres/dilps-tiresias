import { ArtistComponent } from '../../artists/artist/artist.component';
import { AlertService } from './alert/alert.service';
import { MatDialogRef } from '@angular/material/dialog';
import { OnInit } from '@angular/core';
import { merge } from 'lodash';
import { UserService } from '../../users/services/user.service';

export class AbstractDetail implements OnInit {

    public user;

    public data: any = {
        item: {},
    };

    constructor(public service,
                private alertSvc: AlertService,
                public dialogRef: MatDialogRef<ArtistComponent>,
                public userSvc: UserService,
                data: any) {

        this.data = merge({item: this.service.getEmptyObject()}, data);
    }

    ngOnInit() {
        if (this.data.item.id) {
            this.service.getOne(this.data.item.id).subscribe(res => {
                merge(this.data.item, res); // init all fields considering getOne query
                this.postQuery();
            });
        }

        this.userSvc.getCurrentUser().subscribe(user => this.user = user);
    }

    protected postQuery() {}
    protected postUpdate(model) {}

    public update() {
        this.service.update(this.data.item).subscribe((model) => {
            this.alertSvc.info('Mis à jour');
            this.dialogRef.close(this.data.item);
            this.postUpdate(model);
        });
    }

    public create() {
        this.service.create(this.data.item).subscribe(() => {
            this.alertSvc.info('Créé');
            this.dialogRef.close(this.data.item);
        });
    }

    public delete() {
        this.alertSvc.confirm('Suppression', 'Voulez-vous supprimer définitivement cet élément ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.service.delete(this.data.item).subscribe(() => {
                        this.alertSvc.info('Supprimé');
                        this.dialogRef.close(null);
                    });
                }
            });
    }
}
