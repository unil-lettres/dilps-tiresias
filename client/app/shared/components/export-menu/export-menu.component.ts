import {Component, Input} from '@angular/core';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NaturalIconDirective} from '@ecodev/natural';
import {Cards, ExportFormat} from '../../generated-types';
import {ExportService} from 'client/app/exports/services/export.service';
import {EMPTY, Subject, switchMap, takeUntil} from 'rxjs';
import {waitOnApolloQueries} from '../../services/utility';
import {Apollo} from 'apollo-angular';
import {AlertService} from '../alert/alert.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FakeCollection} from 'client/app/collections/services/fake-collection.resolver';

@Component({
    selector: 'app-export-menu',
    templateUrl: './export-menu.component.html',
    styleUrls: ['./export-menu.component.scss'],
    standalone: true,
    imports: [MatMenuModule, MatButtonModule, MatIconModule, NaturalIconDirective, MatTooltipModule],
})
export class ExportMenuComponent {
    @Input()
    public showExcelExportation = true;

    @Input()
    public selectedCards: Cards['cards']['items'][0][] = [];

    @Input()
    public collection: FakeCollection | null | undefined = null;

    public ExportFormat = ExportFormat;

    public pptValidationMessage: string | null = null;

    private menuClosed$ = new Subject<void>();

    public constructor(
        private readonly exportService: ExportService,
        private readonly alertService: AlertService,
        private readonly apollo: Apollo,
    ) {}

    public get hasCards(): boolean {
        return this.selectedCards.length > 0;
    }

    public get hasCollection(): boolean {
        return !!this.collection;
    }

    public get tooltip(): string {
        if (this.hasCollection && !this.hasCards) {
            return 'Exporter la collection';
        } else {
            return 'Exporter';
        }
    }

    public get optionZipLabel(): string {
        if (this.hasCards && !this.hasCollection) {
            if (this.selectedCards.length > 1) {
                return 'Exporter les fiches';
            } else {
                return 'Exporter la fiche';
            }
        } else if (!this.hasCards && this.hasCollection) {
            return 'Exporter la collection';
        } else {
            return 'Exporter les éléments';
        }
    }

    public menuOpened(): void {
        this.pptValidationMessage = 'Validation...';

        const input = this.exportService.getDefaultForServer();
        input.cards = [...this.selectedCards.map(card => card.id)];
        if (this.collection?.id) {
            input.collections = [this.collection.id];
        }
        input.format = ExportFormat.pptx;

        this.exportService
            .validate(input)
            .pipe(takeUntil(this.menuClosed$))
            .subscribe(validationMessage => {
                this.pptValidationMessage = validationMessage;
            });
    }

    public menuClosed(): void {
        this.menuClosed$.next();
        this.menuClosed$.complete();
    }

    public export(format: ExportFormat): void {
        const input = this.exportService.getDefaultForServer();
        input.cards.push(...this.selectedCards.map(card => card.id));
        if (this.collection?.id) {
            input.collections = [this.collection.id];
        }
        input.format = format;
        this.exportService
            .create(input)
            .pipe(
                switchMap(newExport => {
                    if (newExport.filename) {
                        const url = '/export/' + newExport.filename;

                        // Safari blocks the download of the file if the
                        // location of the page is changed while xhr requests
                        // are pending.
                        return waitOnApolloQueries<string>(this.apollo, url);
                    } else {
                        this.alertService.info(
                            "L'exportation est en cours de préparation. Un email vous sera envoyé quand il sera prêt.",
                            8000,
                        );
                        return EMPTY;
                    }
                }),
            )
            .subscribe(url => {
                if (url) {
                    window.document.location.href = url;
                }
            });
    }
}
