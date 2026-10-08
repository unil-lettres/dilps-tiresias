import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {LOCAL_STORAGE, NaturalMemoryStorage} from '@ecodev/natural';
import {of} from 'rxjs';
import {UserService} from '../../users/services/user.service';
import {SITE} from '../config/site';
import {Site, type ViewerQuery} from '../generated-types';
import {MOCK_APOLLO_PROVIDER} from '../testing/MockApolloProvider';
import {viewerCanCreate} from './viewer-can-create';

describe('viewerCanCreate', () => {
    function canCreate(viewer: ViewerQuery['viewer'] | null, permission: 'domain' | 'artist'): boolean {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                MOCK_APOLLO_PROVIDER,
                {provide: SITE, useValue: Site.Dilps},
                {provide: LOCAL_STORAGE, useClass: NaturalMemoryStorage},
            ],
        });
        vi.spyOn(TestBed.inject(UserService), 'getCurrentUser').mockReturnValue(of(viewer));

        return TestBed.runInInjectionContext(() => viewerCanCreate(permission))();
    }

    const junior = {
        id: '1002',
        globalPermissions: {domain: {create: false}, artist: {create: true}},
    } as unknown as ViewerQuery['viewer'];

    it('follows the global permissions of the viewer', () => {
        expect(canCreate(junior, 'artist')).toBe(true);
        TestBed.resetTestingModule();
        expect(canCreate(junior, 'domain')).toBe(false);
    });

    it('lets anonymous create nothing', () => {
        expect(canCreate(null, 'artist')).toBe(false);
    });
});
