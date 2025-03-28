import {TestBed} from '@angular/core/testing';
import {SITE} from '../../app.config';
import {Site, UserType} from '../generated-types';
import {MOCK_APOLLO_PROVIDER} from '../testing/MockApolloProvider';
import {TypePipe} from './type.pipe';
import {LOCAL_STORAGE, NaturalMemoryStorage} from '@ecodev/natural';
import {provideRouter} from '@angular/router';

describe('TypePipe', () => {
    let pipe: TypePipe;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                {
                    provide: TypePipe,
                    useClass: TypePipe,
                },
                MOCK_APOLLO_PROVIDER,
                {
                    provide: SITE,
                    useValue: Site.Tiresias,
                },
                {
                    provide: LOCAL_STORAGE,
                    useClass: NaturalMemoryStorage,
                },
            ],
        });

        pipe = TestBed.inject(TypePipe);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
        expect(pipe.transform(UserType.Default)).toBe('Externe');
        expect(pipe.transform(UserType.Aai)).toBe('AAI');
        expect(pipe.transform(UserType.Legacy)).toBe('Legacy');
        expect(pipe.transform('non-existing-type' as UserType)).toBe('');
    });
});
