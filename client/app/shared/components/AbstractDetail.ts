import {Directive, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {merge} from 'es-toolkit';
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
import {ViewerQuery} from '../generated-types';

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
> implements OnInit {
    protected readonly alertService = inject(AlertService);
    public readonly dialogRef = inject<MatDialogRef<unknown>>(MatDialogRef);
    public readonly userService = inject(UserService);

    /**
     * Once set, this must not change anymore, especially not right after the creation mutation,
     * so the form does not switch from creation mode to update mode without an actual reload of
     * model from DB (by navigating to update page).
     */
    private _isUpdatePage = false;

    public user: ViewerQuery['viewer'] | null = null;

    public data: Data<TService, Extra> = {
        item: {},
    } as Data<TService, Extra>;

    // eslint-disable-next-line @angular-eslint/prefer-inject
    public constructor(public readonly service: TService) {
        const data = inject<{item: ExtractTallOne<TService> & Extra} | undefined>(MAT_DIALOG_DATA);
        this.data = merge({item: {...this.service.getDefaultForServer(), readOnly: true}}, data ?? {});
    }

    public ngOnInit(): void {
        if ('id' in this.data.item && this.data.item.id) {
            this.service.getOne(this.data.item.id).subscribe((res: any) => {
                merge(this.data.item, res); // init all fields considering getOne query
                this._isUpdatePage = true;
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
        return this._isUpdatePage;
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
            .confirm(
                this.getTitleDeleteMessage(),
                this.getDeleteMessage(),
                'Supprimer définitivement',
                undefined,
                'error',
                'filled',
            )
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

    protected getDeleteMessage(): string {
        return `<strong>Cette action est irréversible.</strong>`;
    }

    protected getTitleDeleteMessage(): string {
        return 'Supprimer cet élément ?';
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected postQuery(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    protected postUpdate(model: ExtractTupdate<TService>): void {}
}
