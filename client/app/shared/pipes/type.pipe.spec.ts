import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SITE} from '../../app.config';
import {UserService} from '../../users/services/user.service';
import {Site, UserType} from '../generated-types';
import {MOCK_APOLLO_PROVIDER} from '../testing/MockApolloProvider';
import {TypePipe} from './type.pipe';
import {LOCAL_STORAGE, NaturalMemoryStorage} from '@ecodev/natural';

describe('TypePipe', () => {
    let pipe: TypePipe;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                {
                    provide: TypePipe,
                    useClass: TypePipe,
                },
                {
                    provide: UserService,
                    useClass: UserService,
                },
                MOCK_APOLLO_PROVIDER,
                {
                    provide: SITE,
                    useValue: Site.tiresias,
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
        expect(pipe.transform(UserType.default)).toBe('Externe');
        expect(pipe.transform(UserType.aai)).toBe('AAI');
        expect(pipe.transform(UserType.legacy)).toBe('Legacy');
        expect(pipe.transform('non-existing-type' as UserType)).toBe('');
    });
});
