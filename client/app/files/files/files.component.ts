import {Component, inject, Input, OnInit} from '@angular/core';
import {Card, FileInput, FileMinimal, FilesVariables} from '../../shared/generated-types';
import {
    FileSelection,
    NaturalDataSource,
    NaturalFileSelectDirective,
    NaturalQueryVariablesManager,
    PaginatedData,
} from '@ecodev/natural';
import {FileService} from '../services/file.service';
import {map} from 'rxjs/operators';
import {AlertService} from '../../shared/components/alert/alert.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCell, MatCellDef, MatColumnDef, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {NgClass} from '@angular/common';
import {UPLOAD_CONFIG} from '../../shared/config/upload.config';
import {handleFileSizeErrors} from '../../shared/utils/file-selection.utils';

type Tuple = {
    file?: FileMinimal;
    input?: FileInput;
};

@Component({
    selector: 'app-files',
    imports: [
        NgClass,
        MatTable,
        MatColumnDef,
        MatCellDef,
        MatRowDef,
        MatCell,
        MatRow,
        MatButton,
        MatIconButton,
        MatTooltip,
        HideTooltipDirective,
        MatIcon,
        MatProgressSpinner,
        NaturalFileSelectDirective,
    ],
    templateUrl: './files.component.html',
    styleUrl: './files.component.scss',
})
export class FilesComponent implements OnInit {
    private readonly fileService = inject(FileService);
    private readonly alertService = inject(AlertService);

    public get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    public set disabled(value: boolean) {
        this._disabled = value;

        this.columns = this._disabled ? ['name'] : ['name', 'delete'];
    }

    protected columns: string[] = [];
    private _card!: Card['card'];

    private _disabled = false;

    protected readonly accept = UPLOAD_CONFIG.ACCEPTED_CARD_FILES_TYPES;
    protected readonly maxFileSize = UPLOAD_CONFIG.MAX_FILE_SIZE;

    public get card(): Card['card'] {
        return this._card;
    }

    @Input({required: true})
    public set card(card: Card['card']) {
        this._card = card;

        if (this._card?.id) {
            const filter: FilesVariables = {
                filter: {groups: [{conditions: [{card: {equal: {value: this._card.id}}}]}]},
            };

            this.filesQvm.set('filter', filter);
        }
    }

    protected dataSource!: NaturalDataSource<PaginatedData<Tuple>>;
    private readonly filesQvm = new NaturalQueryVariablesManager<FilesVariables>();

    public constructor() {
        // Trigger column selection
        this.disabled = false;
    }

    public ngOnInit(): void {
        const files = this.fileService.getAll(this.filesQvm);
        this.dataSource = new NaturalDataSource<PaginatedData<Tuple>>(
            files.pipe(
                map(result => {
                    return {
                        ...result,
                        items: result.items.map(item => {
                            return {file: item};
                        }),
                    };
                }),
            ),
        );
    }

    protected uploadFiles(selection: FileSelection): void {
        handleFileSizeErrors(selection, this.alertService);

        selection.valid.forEach(file => {
            const input: FileInput = {
                card: this._card,
                name: file.name,
                file: file,
            };

            const tuple: Tuple = {input: input};
            this.dataSource.push(tuple);

            this.fileService.create(input).subscribe(newFile => {
                tuple.file = newFile;
                delete tuple.input;
            });
        });
    }

    protected delete(tuple: Tuple): void {
        this.alertService
            .confirm(`Suppression`, `Voulez-vous supprimer définitivement le fichier ?`, `Supprimer définitivement`)
            .subscribe(confirmed => {
                if (confirmed) {
                    this.fileService.delete([tuple.file!]).subscribe(() => this.dataSource.remove(tuple));
                }
            });
    }
}
