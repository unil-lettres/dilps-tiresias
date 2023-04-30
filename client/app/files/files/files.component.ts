import {Component, Input, OnInit} from '@angular/core';
import {Card_card, FileInput, FileMinimal, FilesVariables} from '../../shared/generated-types';
import {
    FileSelection,
    NaturalAbstractController,
    NaturalDataSource,
    NaturalQueryVariablesManager,
    PaginatedData,
} from '@ecodev/natural';
import {FileService} from '../services/file.service';
import {map} from 'rxjs/operators';
import {AlertService} from '../../shared/components/alert/alert.service';

interface Tuple {
    file?: FileMinimal;
    input?: FileInput;
}

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
})
export class FilesComponent extends NaturalAbstractController implements OnInit {
    public get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    public set disabled(value: boolean) {
        this._disabled = value;

        this.columns = this._disabled ? ['name'] : ['name', 'delete'];
    }

    public columns: string[] = [];
    private _card!: Card_card;

    private _disabled = false;

    /**
     * This list should be kept in sync with \Application\Model\File::getAcceptedMimeTypes
     */
    public readonly accept = '.pdf, .doc, .docx, .xls, .xlsx, .odt, .ods';

    public get card(): Card_card {
        return this._card;
    }

    @Input()
    public set card(card: Card_card) {
        this._card = card;

        if (this._card && this._card.id) {
            const filter: FilesVariables = {
                filter: {groups: [{conditions: [{card: {equal: {value: this._card.id}}}]}]},
            };

            this.filesQvm.set('filter', filter);
        }
    }

    public dataSource!: NaturalDataSource<PaginatedData<Tuple>>;
    private readonly filesQvm = new NaturalQueryVariablesManager<FilesVariables>();

    public constructor(private readonly fileService: FileService, private readonly alertService: AlertService) {
        super();

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

    public uploadFiles(selection: FileSelection): void {
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

    public delete(tuple: Tuple): void {
        this.alertService
            .confirm(`Suppression`, `Voulez-vous supprimer définitivement le fichier ?`, `Supprimer définitivement`)
            .subscribe(confirmed => {
                if (confirmed) {
                    this.fileService.delete([tuple.file!]).subscribe(() => this.dataSource.remove(tuple));
                }
            });
    }
}
