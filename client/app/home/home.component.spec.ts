import {TestBed} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {provideRouter, Router, RouteReuseStrategy} from '@angular/router';
import {type FileSelection, LOCAL_STORAGE, NaturalMemoryStorage} from '@ecodev/natural';
import {of} from 'rxjs';
import {AppRouteReuseStrategy} from '../app-route-reuse-strategy';
import {CardService} from '../card/services/card.service';
import {SITE} from '../shared/config/site';
import {Site, UserRole, type ViewerQuery} from '../shared/generated-types';
import {MOCK_APOLLO_PROVIDER} from '../shared/testing/MockApolloProvider';
import {HomeComponent} from './home.component';

type Testable = {
    user: ViewerQuery['viewer'] | null;
    uploadImages: (selection: FileSelection) => void;
    uploadImagesOnly: (files: File[]) => void;
    uploadImagesAndExcel: (excel: File, images: File[]) => void;
    showThesaurusMenu: () => boolean;
};

describe('HomeComponent', () => {
    const image1 = new File(['1'], 'image1.jpg', {type: 'image/jpeg'});
    const image2 = new File(['2'], 'image2.tiff', {type: 'image/tiff'});
    const excel = new File(['excel'], 'import.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    let dialog: {open: ReturnType<typeof vi.fn>};
    let createWithCollection: ReturnType<typeof vi.fn>;

    function create(site: Site, collection: {id: string} | null = {id: '2000'}): Testable {
        dialog = {open: vi.fn(() => ({afterClosed: () => of(collection)}))};
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                MOCK_APOLLO_PROVIDER,
                {provide: SITE, useValue: site},
                {provide: LOCAL_STORAGE, useClass: NaturalMemoryStorage},
                {provide: MatDialog, useValue: dialog},
                {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy},
            ],
        });

        createWithCollection = vi.spyOn(TestBed.inject(CardService), 'createWithCollection').mockReturnValue(of({}));
        vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

        return TestBed.runInInjectionContext(() => new HomeComponent()) as unknown as Testable;
    }

    describe('adding images', () => {
        it('imports the Excel file with the images it describes', () => {
            const component = create(Site.Tiresias);
            const withExcel = vi.spyOn(component, 'uploadImagesAndExcel').mockReturnValue(undefined);

            component.uploadImages({valid: [image1, excel, image2], invalid: []});

            expect(withExcel).toHaveBeenCalledWith(excel, [image1, image2]);
        });

        it('creates a card per image, without Excel file', () => {
            const component = create(Site.Dilps);
            const imagesOnly = vi.spyOn(component, 'uploadImagesOnly');

            component.uploadImages({valid: [image1, image2], invalid: []});

            expect(imagesOnly).toHaveBeenCalledWith([image1, image2]);
            expect(createWithCollection).toHaveBeenCalledTimes(2);
            expect(createWithCollection.mock.calls.map(([input, collection]) => [input.file, collection])).toEqual([
                [image1, undefined],
                [image2, undefined],
            ]);
        });

        it('asks for a collection on Tiresias, and puts the images in it', () => {
            const component = create(Site.Tiresias);

            component.uploadImagesOnly([image1]);

            expect(dialog.open).toHaveBeenCalledTimes(1);
            expect(createWithCollection).toHaveBeenCalledWith(expect.objectContaining({file: image1}), {id: '2000'});
        });

        it('adds nothing on Tiresias if no collection is chosen', () => {
            // The dialog is closed without choosing a collection
            const component = create(Site.Tiresias, null);

            component.uploadImagesOnly([image1]);

            expect(createWithCollection).not.toHaveBeenCalled();
        });

        it('ignores the files too big', () => {
            const component = create(Site.Dilps);

            component.uploadImages({valid: [image1], invalid: [{file: image2, error: 'fileSize'}]});

            expect(createWithCollection).toHaveBeenCalledTimes(1);
        });
    });

    describe('menu of the thesauri', () => {
        function canSee(site: Site, role: UserRole): boolean {
            TestBed.resetTestingModule();
            const component = create(site);
            component.user = {id: '1', role} as ViewerQuery['viewer'];

            return component.showThesaurusMenu();
        }

        it('is shown on Dilps to all roles but students', () => {
            expect(canSee(Site.Dilps, UserRole.administrator)).toBe(true);
            expect(canSee(Site.Dilps, UserRole.major)).toBe(true);
            expect(canSee(Site.Dilps, UserRole.senior)).toBe(true);
            expect(canSee(Site.Dilps, UserRole.junior)).toBe(true);
            expect(canSee(Site.Dilps, UserRole.student)).toBe(false);
        });

        it('is shown on Tiresias only to administrators', () => {
            expect(canSee(Site.Tiresias, UserRole.administrator)).toBe(true);
            expect(canSee(Site.Tiresias, UserRole.major)).toBe(false);
            expect(canSee(Site.Tiresias, UserRole.senior)).toBe(false);
        });
    });
});
