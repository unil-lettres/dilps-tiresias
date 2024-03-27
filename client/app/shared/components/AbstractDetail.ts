import {Directive, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {merge} from 'lodash-es';
import {UserService} from '../../users/services/user.service';
import {AlertService} from './alert/alert.service';
import {
    ExtractTallOne,
    ExtractTone,
    ExtractTupdate,
    ExtractVcreate,
    Literal,
    NaturalAbstractModelService,
    PaginatedData,
    QueryVariables,
    WithId,
} from '@ecodev/natural';
import {Viewer} from '../generated-types';

type Data<TService, Extra> = {
    item: {id?: string} & (ExtractTone<TService> | ExtractVcreate<TService>['input']) & Extra;
};

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
    /**
     * Once set, this must not change anymore, especially not right after the creation mutation,
     * so the form does not switch from creation mode to update mode without an actual reload of
     * model from DB (by navigating to update page).
     */
    #isUpdatePage = false;

    public user: Viewer['viewer'] | null = null;

    public data: Data<TService, Extra> = {
        item: {},
    } as Data<TService, Extra>;

    public constructor(
        public readonly service: TService,
        private readonly alertService: AlertService,
        public readonly dialogRef: MatDialogRef<unknown>,
        public readonly userService: UserService,
        data: {item: ExtractTallOne<TService> & Extra} | undefined,
    ) {
        this.data = merge({item: this.service.getDefaultForServer()}, data);
    }

    public ngOnInit(): void {
        if ('id' in this.data.item && this.data.item.id) {
            this.service.getOne(this.data.item.id).subscribe(res => {
                merge(this.data.item, res); // init all fields considering getOne query
                this.#isUpdatePage = true;
                this.postQuery();
            });
        }

        this.userService.getCurrentUser().subscribe(user => (this.user = user));
    }

    /**
     * Returns whether `data.model` was fetched from DB, so we are on an update page, or if it is a new object
     * with (only) default values, so we are on a creation page.
     *
     * This should be used instead of checking `data.model.id` directly, in order to type guard and get proper typing
     */
    protected isUpdatePage(): this is {data: {item: WithId<ExtractTone<TService>>}} {
        return this.#isUpdatePage;
    }

    public update(): void {
        this.service.updateNow(this.data.item).subscribe(model => {
            this.alertService.info('Mis à jour');
            this.dialogRef.close(this.data.item);
            this.postUpdate(model);
        });
    }

    public create(): void {
        this.service.create(this.data.item).subscribe(newItem => {
            this.alertService.info('Créé');
            this.dialogRef.close(newItem);
        });
    }

    public delete(): void {
        this.alertService
            .confirm('Suppression', 'Voulez-vous supprimer définitivement cet élément ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (!confirmed || !this.isUpdatePage()) {
                    return;
                }
                this.service.delete([this.data.item]).subscribe(() => {
                    this.alertService.info('Supprimé');
                    this.dialogRef.close(null);
                });
            });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected postQuery(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    protected postUpdate(model: ExtractTupdate<TService>): void {}
}
