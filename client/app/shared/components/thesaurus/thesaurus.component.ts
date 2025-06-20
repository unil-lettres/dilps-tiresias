import {Component, DestroyRef, ElementRef, inject, Input, OnInit, output, viewChild} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    MatAutocompleteModule,
    MatAutocompleteSelectedEvent,
    MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
    HierarchicDialogConfig,
    Literal,
    NaturalAbstractModelService,
    NaturalHierarchicConfiguration,
    NaturalHierarchicSelectorDialogService,
    NaturalQueryVariablesManager,
    PaginatedData,
    QueryVariables,
} from '@ecodev/natural';
import {clone, isObject, merge} from 'lodash-es';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {formatYearRange} from '../../services/utility';
import {ComponentType} from '@angular/cdk/overlay';
import {MatOptionModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export type ThesaurusModel = {
    name: string;
    locality?: string;
    hierarchicName?: string;
    __typename?: string;
    from?: number | null;
    to?: number | null;
};

@Component({
    selector: 'app-thesaurus',
    templateUrl: './thesaurus.component.html',
    styleUrl: './thesaurus.component.scss',
    imports: [
        MatFormFieldModule,
        MatChipsModule,
        MatIconModule,
        FormsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatOptionModule,
    ],
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
> implements OnInit
{
    private readonly dialog = inject(MatDialog);
    private readonly hierarchicSelectorDialogService = inject(NaturalHierarchicSelectorDialogService);

    private readonly destroyRef = inject(DestroyRef);

    /**
     * Reference to autocomplete
     */
    public readonly autocomplete = viewChild.required(MatAutocompleteTrigger);

    /**
     * Reference to input field for add a thesaurus.
     */
    public readonly thesaurusInput = viewChild.required<ElementRef<HTMLInputElement>>('thesaurusInput');

    /**
     * If true, manipulations are forbidden
     */
    @Input() public readonly = false;

    /**
     * Service used as data source
     */
    @Input({required: true}) public service!: TService;

    /**
     * Input label name
     */
    @Input({required: true}) public placeholder!: string;

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
    @Input() public previewComponent: ComponentType<unknown> | undefined;

    /**
     * The search query for the autocomplete list will search the beginning of
     * the name (like name%) if true, otherwise will search anywhere in the
     * name.
     */
    @Input() public matchFromStartAutocomplete = false;

    /**
     * The maximum length of the search query for the autocomplete list
     * when matchFromStartAutocomplete is true. When max length is reached,
     * the search will revert to its default behavior.
     */
    @Input() public matchFromStartAutocompleteMaxLength = 2;

    /**
     * Emits when a selection is done
     */
    public readonly modelChange = output<string | string[] | ThesaurusModel | ThesaurusModel[] | null>();

    /**
     * Configuration for hierarchic relations
     */
    @Input() public hierarchicSelectorConfig: NaturalHierarchicConfiguration[] | undefined;

    /**
     * Number of items not shown in result list
     * Shows a message after list if positive
     */
    public moreNbItems = 0;

    /**
     * List of suggestions for autocomplete dropdown
     */
    public suggestions!: ThesaurusModel[];

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
    private resultsCache!: Observable<any>;

    /**
     * Default page size
     */
    private pageSize = 30;

    /**
     * Query variables manger
     */
    private readonly variablesManager = new NaturalQueryVariablesManager();

    /**
     * Prevent bug opening twice hierarchic dialog on ff
     */
    private lockOpenDialog!: boolean;

    private readonly formChange$ = this.formControl.valueChanges.pipe(
        takeUntilDestroyed(),
        distinctUntilChanged(),
        filter(val => typeof val === 'string'),
        debounceTime(300),
    );

    private _model: ThesaurusModel | ThesaurusModel[] | null | undefined = null;

    @Input({required: true})
    public set model(val: ThesaurusModel | ThesaurusModel[] | null | undefined) {
        this._model = val;
        this.convertModel();
    }

    public ngOnInit(): void {
        this.convertModel();

        this.variablesManager.set('pagination', {pagination: {pageIndex: 0, pageSize: this.pageSize}});

        this.formChange$.subscribe(val => {
            if (this.matchFromStartAutocomplete && val.length <= this.matchFromStartAutocompleteMaxLength) {
                this.variablesManager.set('search', {
                    filter: {groups: [{conditions: [{name: {like: {value: `${val}%`}}}]}]},
                });
            } else {
                this.variablesManager.set('search', {
                    filter: {groups: [{conditions: [{custom: {search: {value: val}}}]}]},
                });
            }
        });
    }

    public openItem(item: ThesaurusModel): void {
        if (!this.previewComponent) {
            return;
        }

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

        this.resultsCache = this.service.watchAll(this.variablesManager).pipe(takeUntilDestroyed(this.destroyRef));

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
            .subscribe(result => {
                this.lockOpenDialog = false;
                if (result?.hierarchicSelection) {
                    // Find the only selection amongst all possible keys
                    const keyWithSelection = Object.keys(result.hierarchicSelection).find(
                        key => result.hierarchicSelection?.[key][0],
                    );
                    const selection = keyWithSelection ? result.hierarchicSelection[keyWithSelection] : [];

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
    public onEnter(): void {
        const inputValue = this.thesaurusInput().nativeElement.value;
        if (inputValue && this.allowFreeText) {
            this.addTerm({name: inputValue});
        }
    }

    /**
     * When click or keypress enter on a suggestion
     */
    public selectSuggestion(event: MatAutocompleteSelectedEvent): void {
        this.addTerm(event.option.value);
    }

    private getSelectKey(): string {
        if (!this.hierarchicSelectorConfig) {
            return '';
        }

        return this.hierarchicSelectorConfig.find(c => !!c.selectableAtKey)!.selectableAtKey!;
    }

    /**
     * Add term to list
     * The elements are kept unique within the list.
     * Always close the panel (without resetting results)
     */
    private addTerm(term: ThesaurusModel): void {
        this.autocomplete().closePanel();
        const indexOf = this.items.findIndex(item => item.name === term.name);
        if (term && indexOf === -1) {
            if (!this.multiple) {
                this.items.length = 0;
            }
            this.items.push(clone(term)); // clone to get rid of readonly
            this.notifyModel();
        }
        this.thesaurusInput().nativeElement.value = '';
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
        } else if (this.multiple && Array.isArray(this._model)) {
            this.items = clone(this._model); // clone to get rid of readonly
            this.notifyModel();
        }
    }

    public getLabel(item: ThesaurusModel): string {
        let result = item.hierarchicName || item.name;

        if (!this.readonly && item.__typename === 'Period') {
            result += formatYearRange(item.from!, item.to!);
        }

        return result;
    }
}
