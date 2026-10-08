import {TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {provideRouter} from '@angular/router';
import {LOCAL_STORAGE, NaturalMemoryStorage} from '@ecodev/natural';
import {of} from 'rxjs';
import {SITE} from '../../shared/config/site';
import {CollectionVisibility, Site, UserRole, type ViewerQuery} from '../../shared/generated-types';
import {MOCK_APOLLO_PROVIDER} from '../../shared/testing/MockApolloProvider';
import {UserService} from '../../users/services/user.service';
import {CollectionComponent} from './collection.component';

type Testable = {
    showVisibility: boolean;
    visibility: 1 | 2 | 3;
    computeShowVisibility: () => boolean;
    maxVisibility: () => 1 | 2 | 3;
    postQuery: () => void;
    updateVisibility: () => void;
};

/**
 * The mock API gives the ID 456 to everything, including the creator of the collection
 */
const creatorId = '456';

describe('CollectionComponent', () => {
    async function create(item: Record<string, unknown>, role: UserRole, viewerId = creatorId): Promise<Testable> {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                MOCK_APOLLO_PROVIDER,
                {provide: SITE, useValue: Site.Dilps},
                {provide: LOCAL_STORAGE, useClass: NaturalMemoryStorage},
                {provide: MAT_DIALOG_DATA, useValue: {item}},
                {provide: MatDialogRef, useValue: {close: vi.fn()}},
            ],
        });

        vi.spyOn(TestBed.inject(UserService), 'getCurrentUser').mockReturnValue(
            of({id: viewerId, role} as ViewerQuery['viewer']),
        );

        const fixture = TestBed.createComponent(CollectionComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        return fixture.componentInstance as unknown as Testable;
    }

    function withVisibility(component: Testable, visibility: CollectionVisibility): Testable {
        (component as unknown as CollectionComponent).data.item.visibility = visibility;

        return component;
    }

    it('lets seniors and above make their own collections public', async () => {
        for (const role of [UserRole.senior, UserRole.major, UserRole.administrator]) {
            TestBed.resetTestingModule();
            const component = await create({id: '2000'}, role);

            await vi.waitFor(() => expect(component.showVisibility).toBe(true));
            expect(component.maxVisibility()).toBe(3);
        }
    });

    it('lets students and juniors make their own collections visible to administrators, but not public', async () => {
        for (const role of [UserRole.student, UserRole.junior]) {
            TestBed.resetTestingModule();
            const component = await create({id: '2000'}, role);

            await vi.waitFor(() => expect(component.showVisibility).toBe(true));
            expect(component.maxVisibility()).toBe(2);
        }
    });

    it('lets students and juniors keep public their collections made public by an administrator', async () => {
        const component = await create({id: '2000'}, UserRole.junior);
        withVisibility(component, CollectionVisibility.Member).postQuery();

        expect(component.maxVisibility()).toBe(3);
    });

    it('lets administrators change the visibility of the shared collections of someone else', async () => {
        const component = await create({id: '2000'}, UserRole.administrator, '1000');

        expect(withVisibility(component, CollectionVisibility.Member).computeShowVisibility()).toBe(true);
        expect(withVisibility(component, CollectionVisibility.Administrator).computeShowVisibility()).toBe(true);
        expect(withVisibility(component, CollectionVisibility.Private).computeShowVisibility()).toBe(false);
    });

    it('does not let seniors change the visibility of the collections of someone else', async () => {
        const component = await create({id: '2000'}, UserRole.senior, '1000');

        expect(withVisibility(component, CollectionVisibility.Member).computeShowVisibility()).toBe(false);
    });

    it('gives the visibility of each position of the slider', async () => {
        const component = await create({id: '2000'}, UserRole.senior);
        const visibilities: CollectionVisibility[] = [];

        for (const position of [1, 2, 3] as const) {
            component.visibility = position;
            component.updateVisibility();
            visibilities.push((component as unknown as CollectionComponent).data.item.visibility!);
        }

        expect(visibilities).toEqual([
            CollectionVisibility.Private,
            CollectionVisibility.Administrator,
            CollectionVisibility.Member,
        ]);
    });

    it('lets students and juniors choose the visibility of a new collection, but not public', async () => {
        for (const role of [UserRole.student, UserRole.junior]) {
            TestBed.resetTestingModule();
            const component = await create({}, role);

            expect(component.showVisibility).toBe(true);
            expect(component.maxVisibility()).toBe(2);
        }
    });

    it('lets seniors and above choose any visibility of a new collection', async () => {
        for (const role of [UserRole.senior, UserRole.major, UserRole.administrator]) {
            TestBed.resetTestingModule();
            const component = await create({}, role);

            expect(component.showVisibility).toBe(true);
            expect(component.maxVisibility()).toBe(3);
        }
    });
});
