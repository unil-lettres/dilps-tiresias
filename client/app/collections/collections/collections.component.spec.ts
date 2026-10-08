import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {LOCAL_STORAGE, NaturalMemoryStorage} from '@ecodev/natural';
import {SITE} from '../../shared/config/site';
import {type CollectionsQuery, Site, UserRole, type ViewerQuery} from '../../shared/generated-types';
import {MOCK_APOLLO_PROVIDER} from '../../shared/testing/MockApolloProvider';
import {CollectionsComponent} from './collections.component';

type Collection = CollectionsQuery['collections']['items'][0];

type Testable = {
    canExport: (collection: Collection) => boolean;
    subscribersTooltip: (collection: Collection) => string;
    showCreateButton: (allowedRoles: boolean | UserRole[], user: ViewerQuery['viewer'] | null) => boolean;
};

describe('CollectionsComponent', () => {
    let component: Testable;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                MOCK_APOLLO_PROVIDER,
                {provide: SITE, useValue: Site.Dilps},
                {provide: LOCAL_STORAGE, useClass: NaturalMemoryStorage},
            ],
        });
        component = TestBed.runInInjectionContext(() => new CollectionsComponent()) as unknown as Testable;
    });

    function collection(fields: Partial<Collection> = {}): Collection {
        return {
            id: '2000',
            permissions: {update: false, delete: false},
            viewerIsResponsible: false,
            viewerIsSubscriber: false,
            responsiblesCount: 0,
            subscribersCount: 0,
            ...fields,
        } as Collection;
    }

    it('lets export the collections related to the user', () => {
        expect(
            component.canExport(collection({permissions: {update: true, delete: false}} as Partial<Collection>)),
        ).toBe(true);
        expect(
            component.canExport(collection({permissions: {update: false, delete: true}} as Partial<Collection>)),
        ).toBe(true);
        expect(component.canExport(collection({viewerIsResponsible: true}))).toBe(true);
        expect(component.canExport(collection({viewerIsSubscriber: true}))).toBe(true);
    });

    it('does not let export the collections unrelated to the user', () => {
        expect(component.canExport(collection())).toBe(false);
    });

    it('counts the responsibles among the subscribers', () => {
        expect(component.subscribersTooltip(collection({subscribersCount: 1}))).toBe('1 abonné·e');
        expect(component.subscribersTooltip(collection({responsiblesCount: 1, subscribersCount: 2}))).toBe(
            '3 abonné·es',
        );
    });

    describe('button to create a collection', () => {
        function user(role: UserRole): ViewerQuery['viewer'] {
            return {id: '1', role} as ViewerQuery['viewer'];
        }

        it('is shown to everybody in their own collections', () => {
            expect(component.showCreateButton(true, user(UserRole.student))).toBe(true);
        });

        it('is shown only to the given roles, eg: administrators for the fonds', () => {
            expect(component.showCreateButton([UserRole.administrator], user(UserRole.administrator))).toBe(true);
            expect(component.showCreateButton([UserRole.administrator], user(UserRole.major))).toBe(false);
        });

        it('is hidden in the public collections, and to anonymous', () => {
            expect(component.showCreateButton(false, user(UserRole.administrator))).toBe(false);
            expect(component.showCreateButton([], user(UserRole.administrator))).toBe(false);
            expect(component.showCreateButton(true, null)).toBe(false);
        });
    });
});
