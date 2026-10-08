import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {ExportService} from '../../../exports/services/export.service';
import {type FakeCollection} from '../../../collections/services/fake-collection.resolver';
import {type CardsQuery, type CreateExportInput, ExportFormat, Site} from '../../generated-types';
import {AlertService} from '../alert/alert.service';
import {ExportMenuComponent, ExportTheme} from './export-menu.component';

describe('ExportMenuComponent', () => {
    let fixture: ComponentFixture<ExportMenuComponent>;
    let component: ExportMenuComponent;
    let exportService: {
        getDefaultForServer: () => Required<CreateExportInput>;
        validate: ReturnType<typeof vi.fn>;
        create: ReturnType<typeof vi.fn>;
    };
    let alertService: {info: ReturnType<typeof vi.fn>};

    const card1 = {id: '6000'} as CardsQuery['cards']['items'][0];
    const card2 = {id: '6001'} as CardsQuery['cards']['items'][0];
    const collection = {id: '2000'} as FakeCollection;

    beforeEach(() => {
        exportService = {
            getDefaultForServer: () => ({
                format: ExportFormat.Zip,
                maxHeight: 0,
                includeLegend: true,
                textColor: '#FFFFFF',
                backgroundColor: '#000000',
                collections: [],
                cards: [],
                site: Site.Dilps,
            }),
            validate: vi.fn(() => of(null)),

            // Without file, the export is prepared in the background, instead of being downloaded
            create: vi.fn(() => of({filename: null})),
        };
        alertService = {info: vi.fn()};

        TestBed.configureTestingModule({
            providers: [
                {provide: ExportService, useValue: exportService},
                {provide: AlertService, useValue: alertService},
            ],
        });

        fixture = TestBed.createComponent(ExportMenuComponent);
        component = fixture.componentInstance;
    });

    function setUp(cards: CardsQuery['cards']['items'][0][], fakeCollection: FakeCollection | null = null): void {
        fixture.componentRef.setInput('selectedCards', cards);
        fixture.componentRef.setInput('collection', fakeCollection);
        fixture.detectChanges();
    }

    function exportAs(format: ExportFormat, theme?: ExportTheme): void {
        (component as unknown as {export: (f: ExportFormat, t?: ExportTheme) => void}).export(format, theme);
    }

    function menuItem(label: string): HTMLButtonElement {
        const items = Array.from(document.querySelectorAll<HTMLButtonElement>('[mat-menu-item]'));
        const item = items.find(button => button.textContent?.trim() === label);
        if (!item) {
            const labels = items.map(button => button.textContent?.trim()).join(', ');
            throw new Error(`No menu item "${label}" among: ${labels}`);
        }

        return item;
    }

    async function openMenu(): Promise<void> {
        fixture.nativeElement.querySelector('button').click();
        fixture.detectChanges();
        await fixture.whenStable();
    }

    it('names what is exported', () => {
        setUp([card1]);
        expect(component.tooltip).toBe('Exporter la fiche');
        expect(component.optionZipLabel).toBe('Exporter la fiche');

        setUp([card1, card2]);
        expect(component.tooltip).toBe('Exporter les fiches sélectionnées');
        expect(component.optionZipLabel).toBe('Exporter les fiches');

        setUp([], collection);
        expect(component.tooltip).toBe('Exporter la collection');
        expect(component.optionZipLabel).toBe('Exporter la collection');

        setUp([card1, card2], collection);
        expect(component.optionZipLabel).toBe('Exporter les éléments');
    });

    it('exports the selected cards and the collection', () => {
        setUp([card1, card2], collection);

        exportAs(ExportFormat.Zip);

        expect(exportService.create).toHaveBeenCalledWith(
            expect.objectContaining({format: ExportFormat.Zip, cards: ['6000', '6001'], collections: ['2000']}),
        );
        expect(alertService.info).toHaveBeenCalledWith(
            "L'exportation est en cours de préparation. Un email vous sera envoyé quand il sera prêt.",
            8000,
        );
    });

    it('exports in the colors of the chosen theme, dark by default', () => {
        setUp([card1]);

        exportAs(ExportFormat.Pptx, ExportTheme.light);
        exportAs(ExportFormat.Pptx, ExportTheme.dark);
        exportAs(ExportFormat.Pptx);

        const colors = exportService.create.mock.calls.map(([input]) => [input.backgroundColor, input.textColor]);
        expect(colors).toEqual([
            ['#FFFFFF', '#000000'],
            ['#000000', '#FFFFFF'],
            ['#000000', '#FFFFFF'],
        ]);
    });

    it('validates the exports when opening the menu, and disables the impossible ones', async () => {
        // The same input is reused for each format, so record the format when called, like the service reads it then
        const formats: ExportFormat[] = [];
        exportService.validate.mockImplementation(input => {
            formats.push(input.format);

            return of(input.format === ExportFormat.Pptx ? 'Trop de fiches pour PowerPoint' : null);
        });
        setUp([card1]);

        await openMenu();

        expect(formats).toEqual([ExportFormat.Pptx, ExportFormat.Zip]);
        expect(menuItem('Exporter en PowerPoint').disabled).toBe(true);
        expect(menuItem('Exporter la fiche').disabled).toBe(false);
    });

    // Known bug: "Exporter en PowerPoint" both opens the menu of the themes and exports in the dark theme, so that
    // choosing a theme then exports a second time. Replace `it.fails` by `it` once fixed.
    it.fails('exports in PowerPoint only once the theme is chosen', async () => {
        setUp([card1]);
        await openMenu();

        menuItem('Exporter en PowerPoint').click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(exportService.create).not.toHaveBeenCalled();

        menuItem('Thème clair').click();
        expect(exportService.create).toHaveBeenCalledTimes(1);
    });
});
