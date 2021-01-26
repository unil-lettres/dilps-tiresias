import {Directive, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {merge} from 'lodash-es';
import {ArtistComponent} from '../../artists/artist/artist.component';
import {UserService} from '../../users/services/user.service';
import {AlertService} from './alert/alert.service';
import {ExtractTupdate, NaturalAbstractModelService, PaginatedData, QueryVariables} from '@ecodev/natural';
import {Literal} from '@ecodev/natural/lib/types/types';
import {Viewer_viewer} from '../generated-types';

@Directive()
export class AbstractDetailDirective<
    TService extends NaturalAbstractModelService<
        unknown,
        any,
        PaginatedData<Literal>,
        QueryVariables,
        any,
        any,
        any,
        any,
        unknown,
        any
    >
> implements OnInit {
    public user: Viewer_viewer | null = null;

    public data: any = {
        item: {},
    };

    constructor(
        public service: TService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<unknown>,
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

    protected postUpdate(model: ExtractTupdate<TService>): void {}
}
