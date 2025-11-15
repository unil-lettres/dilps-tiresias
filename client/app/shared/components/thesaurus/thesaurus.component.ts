import {ComponentType} from '@angular/cdk/overlay';
import {Component, DestroyRef, ElementRef, inject, input, Input, OnInit, output, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatIconButton} from '@angular/material/button';
import {MatChipGrid, MatChipInput, MatChipRemove, MatChipRow, MatChipTrailingIcon} from '@angular/material/chips';
import {MatOption} from '@angular/material/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {
    HierarchicDialogConfig,
    Literal,
    makePlural,
    NaturalAbstractModelService,
    NaturalHierarchicConfiguration,
    NaturalHierarchicSelectorDialogService,
    NaturalQueryVariablesManager,
    NaturalSearchSelections,
    PaginatedData,
    QueryVariables,
    toUrl,
} from '@ecodev/natural';
import {isObject} from 'es-toolkit/compat';
import {clone, merge} from 'es-toolkit';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {formatYearRange} from '../../services/utility';

export type ThesaurusModel = {
    id?: string;
    name: string;
    locality?: string;
    hierarchicName?: string;
    __typename?: string;
    from?: number | null;
    to?: number | null;
};

@Component({
    selector: 'app-thesaurus',
    imports: [
        MatFormField,
        MatLabel,
        MatChipGrid,
        MatChipInput,
        MatChipRemove,
        MatChipRow,
        MatChipTrailingIcon,
        MatIcon,
        FormsModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
        ReactiveFormsModule,
        MatOption,
        MatIconButton,
    ],
    templateUrl: './thesaurus.component.html',
    styleUrl: './thesaurus.component.scss',
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
    private readonly router = inject(Router);
    private readonly hierarchicSelectorDialogService = inject(NaturalHierarchicSelectorDialogService);

    private readonly destroyRef = inject(DestroyRef);

    /**
     * Reference to autocomplete
     */
    protected readonly autocomplete = viewChild.required(MatAutocompleteTrigger);

    /**
     * Reference to input field for add a thesaurus.
     */
    protected readonly thesaurusInput = viewChild.required<ElementRef<HTMLInputElement>>('thesaurusInput');

    /**
     * If true, manipulations are forbidden
     */
    public readonly readonly = input(false);

    /**
     * Service used as data source
     */
    public readonly service = input.required<TService>();

    /**
     * Input label name
     */
    public readonly placeholder = input.required<string>();

    /**
     * If multi selection is allowed
     */
    public readonly multiple = input(true);

    /**
     * If multi selection is allowed
     */
    public readonly allowFreeText = input(true);

    /**
     * Component that renders the detail view of an entry
     */
    public readonly previewComponent = input<ComponentType<unknown>>();

    /**
     * The search query for the autocomplete list will search the beginning of
     * the name (like name%) if true, otherwise will search anywhere in the
     * name.
     */
    public readonly matchFromStartAutocomplete = input(false);

    /**
     * The maximum length of the search query for the autocomplete list
     * when matchFromStartAutocomplete is true. When max length is reached,
     * the search will revert to its default behavior.
     */
    public readonly matchFromStartAutocompleteMaxLength = input(2);

    /**
     * Emits when a selection is done
     */
    protected readonly modelChange = output<string | string[] | ThesaurusModel | ThesaurusModel[] | null>();

    /**
     * Configuration for hierarchic relations
     */
    public readonly hierarchicSelectorConfig = input<NaturalHierarchicConfiguration[]>();

    /**
     * Number of items not shown in result list
     * Shows a message after list if positive
     */
    protected moreNbItems = 0;

    /**
     * List of suggestions for autocomplete dropdown
     */
    protected suggestions!: ThesaurusModel[];

    /**
     * List of selected items
     */
    protected items: ThesaurusModel[] = [];

    /**
     * <input> controller
     */
    protected formControl: FormControl = new FormControl();

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
            if (this.matchFromStartAutocomplete() && val.length <= this.matchFromStartAutocompleteMaxLength()) {
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

    protected openItem(item: ThesaurusModel): void {
        const previewComponent = this.previewComponent();
        if (!previewComponent) {
            return;
        }

        this.dialog
            .open(previewComponent, {
                width: '800px',
                data: {item},
            })
            .afterClosed()
            .subscribe(res => {
                merge(item, res);
                this.notifyModel();
            });
    }

    protected focus(): void {
        if (!this.hierarchicSelectorConfig()) {
            this.startSearch();
        } else {
            this.openDialog();
        }
    }

    /**
     * Start search only when focusing on the input
     */
    protected startSearch(): void {
        /**
         * Start search only once
         */
        if (this.resultsCache) {
            return;
        }

        this.resultsCache = this.service().watchAll(this.variablesManager).pipe(takeUntilDestroyed(this.destroyRef));

        this.resultsCache.subscribe(data => {
            const nbTotal = data.length;
            const nbListed = Math.min(data.length, this.pageSize);
            this.moreNbItems = nbTotal - nbListed;
            this.suggestions = data.items.filter((item: ThesaurusModel) =>
                this.items.findIndex(term => term.name === item.name),
            );
        });
    }

    protected openDialog(): void {
        if (this.lockOpenDialog) {
            return;
        }

        this.lockOpenDialog = true;

        const hierarchicSelectorConfig = this.hierarchicSelectorConfig();
        if (this.readonly() || !hierarchicSelectorConfig) {
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
            hierarchicConfig: hierarchicSelectorConfig,
            hierarchicSelection: selected,
            multiple: this.multiple(),
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

                    if (this.multiple()) {
                        this.items = selection;
                        this.notifyModel();
                    } else {
                        this.addTerm(selection[0]);
                    }
                }
            });
    }

    protected removeTerm(term: ThesaurusModel): void {
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
    protected onEnter(): void {
        const inputValue = this.thesaurusInput().nativeElement.value;
        if (inputValue && this.allowFreeText()) {
            this.addTerm({name: inputValue});
        }
    }

    /**
     * When click or keypress enter on a suggestion
     */
    protected selectSuggestion(event: MatAutocompleteSelectedEvent): void {
        this.addTerm(event.option.value);
    }

    private getSelectKey(): string {
        const hierarchicSelectorConfig = this.hierarchicSelectorConfig();
        if (!hierarchicSelectorConfig) {
            return '';
        }

        return hierarchicSelectorConfig.find(c => !!c.selectableAtKey)!.selectableAtKey!;
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
            if (!this.multiple()) {
                this.items.length = 0;
            }
            this.items.push(clone(term)); // clone to get rid of readonly
            this.notifyModel();
        }
        this.thesaurusInput().nativeElement.value = '';
    }

    private notifyModel(): void {
        const multiple = this.multiple();
        const allowFreeText = this.allowFreeText();
        if (multiple && allowFreeText) {
            this.modelChange.emit(this.items.map(v => v.name));
        } else if (!multiple && allowFreeText) {
            this.modelChange.emit(this.items[0] ? this.items[0].name : null);
        } else if (multiple && !allowFreeText) {
            this.modelChange.emit(this.items);
        } else if (!multiple && !allowFreeText) {
            this.modelChange.emit(this.items[0] || null);
        }
    }

    /**
     * Convert [{name: 'Yippi Kay yay'}] to ['Yippi Kay yay'].
     * Affects the original object
     */
    private convertModel(): void {
        const multiple = this.multiple();
        if (!multiple && isObject(this._model)) {
            this.items = [this._model as ThesaurusModel];
            this.notifyModel();
        } else if (multiple && Array.isArray(this._model)) {
            this.items = clone(this._model); // clone to get rid of readonly
            this.notifyModel();
        }
    }

    protected getLabel(item: ThesaurusModel): string {
        let result = item.hierarchicName || item.name;

        if (!this.readonly() && item.__typename === 'Period') {
            result += formatYearRange(item.from!, item.to!);
        }

        return result;
    }

    protected search(item: ThesaurusModel): void {
        if (!item.id || !item.__typename) {
            return; // required for typing, but should not happen, button is already hidden in this situation
        }

        // Converts AntiqueName to antiqueName, etc... to match facets fields.
        let field = this.multiple() ? makePlural(item.__typename) : item.__typename;
        field = field.charAt(0).toLowerCase() + field.slice(1);

        const naturalSearchSelections: NaturalSearchSelections = [[{field, condition: {have: {values: [item.id]}}}]];
        const ns = JSON.stringify(toUrl(naturalSearchSelections));
        this.router.navigate(['/home', {ns}]);
    }
}
