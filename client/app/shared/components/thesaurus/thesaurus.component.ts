import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
    HierarchicDialogConfig,
    HierarchicDialogResult,
    Literal,
    NaturalAbstractController,
    NaturalAbstractModelService,
    NaturalHierarchicConfiguration,
    NaturalHierarchicSelectorDialogService,
    NaturalQueryVariablesManager,
    PaginatedData,
    QueryVariables,
} from '@ecodev/natural';
import {clone, isArray, isObject, isString, merge} from 'lodash-es';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, takeUntil} from 'rxjs/operators';
import {formatYearRange} from '../../services/utility';
import {ComponentType} from '@angular/cdk/overlay';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete/autocomplete';

export interface ThesaurusModel {
    name: string;
    locality?: string;
    hierarchicName?: string;
    __typename?: string;
    from?: number;
    to?: number;
}

@Component({
    selector: 'app-thesaurus',
    templateUrl: './thesaurus.component.html',
    styleUrls: ['./thesaurus.component.scss'],
})
export class ThesaurusComponent<
        TService extends NaturalAbstractModelService<
            any,
            any,
            PaginatedData<ThesaurusModel>,
            QueryVariables,
            any,
            any,
            any,
            any,
            any,
            any
        >,
    >
    extends NaturalAbstractController
    implements OnInit
{
    /**
     * Reference to autocomplete
     */
    @ViewChild(MatAutocompleteTrigger, {static: true}) public autocomplete: MatAutocompleteTrigger;

    /**
     * If true, manipulations are forbidden
     */
    @Input() public readonly = false;

    /**
     * Service used as data source
     */
    @Input() public service: TService;

    /**
     * Input label name
     */
    @Input() public placeholder: string;

    /**
     * If multi selection is allowed
     */
    @Input() public multiple = true;

    /**
     * If multi selection is allowed
     */
    @Input() public allowFreeText = true;

    /**
     * Component that renders the detail view of an entry
     */
    @Input() public previewComponent: ComponentType<unknown>;

    /**
     * Emits when a selection is done
     */
    @Output() public readonly modelChange = new EventEmitter<
        string | string[] | ThesaurusModel | ThesaurusModel[] | null
    >();

    /**
     * Configuration for hierarchic relations
     */
    @Input() public hierarchicSelectorConfig: NaturalHierarchicConfiguration[];

    /**
     * Number of items not shown in result list
     * Shows a message after list if positive
     */
    public moreNbItems = 0;

    /**
     * List of suggestions for autocomplete dropdown
     */
    public suggestions: ThesaurusModel[];

    /**
     * List of selected items
     */
    public items: ThesaurusModel[] = [];

    /**
     * <input> controller
     */
    public formControl: FormControl = new FormControl();

    /**
     * Cache to init search watching only once
     */
    private resultsCache: Observable<any>;

    /**
     * Default page size
     */
    private pageSize = 10;

    /**
     * Query variables manger
     */
    private variablesManager: NaturalQueryVariablesManager = new NaturalQueryVariablesManager();

    /**
     * Prevent bug opening twice hierarchic dialog on ff
     */
    private lockOpenDialog: boolean;

    constructor(
        private readonly dialog: MatDialog,
        private readonly hierarchicSelectorDialogService: NaturalHierarchicSelectorDialogService,
    ) {
        super();
        this.variablesManager.set('pagination', {pagination: {pageIndex: 0, pageSize: 10}});
    }

    private _model: ThesaurusModel | ThesaurusModel[];

    @Input() set model(val: ThesaurusModel | ThesaurusModel[]) {
        this._model = val;
        this.convertModel();
    }

    public ngOnInit(): void {
        this.convertModel();

        this.formControl.valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe),
                distinctUntilChanged(),
                filter(val => isString(val)),
                debounceTime(300),
            )
            .subscribe(val => {
                this.variablesManager.set('search', {
                    filter: {groups: [{conditions: [{custom: {search: {value: val}}}]}]},
                });
            });
    }

    public openItem(item: ThesaurusModel): void {
        this.dialog
            .open(this.previewComponent, {
                width: '800px',
                data: {item: item},
            })
            .afterClosed()
            .subscribe(res => {
                merge(item, res);
                this.notifyModel();
            });
    }

    public focus(): void {
        if (!this.hierarchicSelectorConfig) {
            this.startSearch();
        } else {
            this.openDialog();
        }
    }

    /**
     * Start search only when focusing on the input
     */
    public startSearch(): void {
        /**
         * Start search only once
         */
        if (this.resultsCache) {
            return;
        }

        this.resultsCache = this.service.watchAll(this.variablesManager).pipe(takeUntil(this.ngUnsubscribe));

        // Init query
        this.resultsCache.subscribe(data => {
            const nbTotal = data.length;
            const nbListed = Math.min(data.length, this.pageSize);
            this.moreNbItems = nbTotal - nbListed;
            this.suggestions = data.items.filter((item: ThesaurusModel) =>
                this.items.findIndex(term => term.name === item.name),
            );
        });
    }

    public openDialog(): void {
        if (this.lockOpenDialog) {
            return;
        }

        this.lockOpenDialog = true;

        if (this.readonly || !this.hierarchicSelectorConfig) {
            return;
        }

        const selectAtKey = this.getSelectKey();

        if (!selectAtKey) {
            return;
        }

        const selected: Literal = {};

        if (this.items) {
            selected[selectAtKey] = this.items;
        }

        const hierarchicConfig: HierarchicDialogConfig = {
            hierarchicConfig: this.hierarchicSelectorConfig,
            hierarchicSelection: selected,
            multiple: this.multiple,
        };

        const dialogFocus: MatDialogConfig = {
            restoreFocus: false,
        };

        this.hierarchicSelectorDialogService
            .open(hierarchicConfig, dialogFocus)
            .afterClosed()
            .subscribe((result: HierarchicDialogResult) => {
                this.lockOpenDialog = false;
                if (result && result.hierarchicSelection) {
                    // Find the only selection amongst all possible keys
                    const keyWithSelection = Object.keys(result.hierarchicSelection).find(
                        key => result.hierarchicSelection[key][0],
                    );
                    const selection = keyWithSelection ? result.hierarchicSelection[keyWithSelection] : null;

                    if (this.multiple) {
                        this.items = selection;
                        this.notifyModel();
                    } else {
                        this.addTerm(selection[0]);
                    }
                }
            });
    }

    public removeTerm(term: ThesaurusModel): void {
        const index = this.items.findIndex(item => item.name === term.name);
        if (index >= 0) {
            this.items.splice(index, 1);
            this.notifyModel();
        }
    }

    /**
     * Add a term
     * On enter key, find if there is an active (focused) option in the mat-select).
     * If not add the term as is. If it does, add the selected option.
     */
    public onEnter(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        if (!this.autocomplete.activeOption && this.allowFreeText) {
            this.addTerm({name: target.value});
            target.value = '';
        } else if (this.autocomplete.activeOption) {
            this.addTerm(this.autocomplete.activeOption.value);
            target.value = '';
        }
    }

    /**
     * When click on a suggestion
     */
    public selectSuggestion(event: MatAutocompleteSelectedEvent): void {
        this.addTerm(event.option.value);
    }

    private getSelectKey(): string {
        return this.hierarchicSelectorConfig.filter(c => !!c.selectableAtKey)[0].selectableAtKey;
    }

    /**
     * Add term to list
     * The elements are kept unique within the list.
     * Always close the panel (without resetting results)
     */
    private addTerm(term: ThesaurusModel): void {
        this.autocomplete.closePanel();
        const indexOf = this.items.findIndex(item => item.name === term.name);
        if (term && indexOf === -1) {
            if (!this.multiple) {
                this.items.length = 0;
            }
            this.items.push(clone(term)); // clone to get rid of readonly
            this.notifyModel();
        }
    }

    private notifyModel(): void {
        if (this.multiple && this.allowFreeText) {
            this.modelChange.emit(this.items.map(v => v.name));
        } else if (!this.multiple && this.allowFreeText) {
            this.modelChange.emit(this.items[0] ? this.items[0].name : null);
        } else if (this.multiple && !this.allowFreeText) {
            this.modelChange.emit(this.items);
        } else if (!this.multiple && !this.allowFreeText) {
            this.modelChange.emit(this.items[0] || null);
        }
    }

    /**
     * Convert [{name: 'Yippi Kay yay'}] to ['Yippi Kay yay'].
     * Affects the original object
     */
    private convertModel(): void {
        if (!this.multiple && isObject(this._model)) {
            this.items = [this._model as ThesaurusModel];
            this.notifyModel();
        } else if (this.multiple && isArray(this._model)) {
            this.items = clone(this._model); // clone to get rid of readonly
            this.notifyModel();
        }
    }

    public getLabel(item: ThesaurusModel): string {
        let result = item.hierarchicName || item.name;

        if (!this.readonly && item.__typename === 'Period') {
            result += formatYearRange(item.from, item.to);
        }

        return result;
    }
}
