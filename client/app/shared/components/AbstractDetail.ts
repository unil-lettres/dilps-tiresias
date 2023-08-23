import {Directive, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {merge} from 'lodash-es';
import {UserService} from '../../users/services/user.service';
import {AlertService} from './alert/alert.service';
import {
    ExtractTone,
    ExtractTupdate,
    Literal,
    NaturalAbstractModelService,
    PaginatedData,
    QueryVariables,
    WithId,
} from '@ecodev/natural';
import {Viewer} from '../generated-types';

type Data<TService, Extra> = {item: WithId<ExtractTone<TService>> & Extra};

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
    >,
    Extra extends Record<string, any> = Record<never, any>,
> implements OnInit
{
    public user: Viewer['viewer'] | null = null;

    public data: Data<TService, Extra> = {
        item: {},
    } as Data<TService, Extra>;

    public constructor(
        public readonly service: TService,
        private readonly alertService: AlertService,
        public readonly dialogRef: MatDialogRef<unknown>,
        public readonly userService: UserService,
        data: Data<TService, Extra> | undefined,
    ) {
        this.data = merge({item: this.service.getDefaultForServer()}, data);
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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected postQuery(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    protected postUpdate(model: ExtractTupdate<TService>): void {}
}
