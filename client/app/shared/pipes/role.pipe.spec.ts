import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../users/services/user.service';
import { UserRole } from '../generated-types';
import { MOCK_APOLLO_PROVIDER } from '../testing/MOCK_APOLLO_PROVIDER';
import { RolePipe } from './role.pipe';

describe('RolePipe', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
            ],
            providers: [
                {
                    provide: RolePipe,
                    useClass: RolePipe,
                },
                {
                    provide: UserService,
                    useClass: UserService,
                },
                MOCK_APOLLO_PROVIDER,
            ],
        });
    });

    it('create an instance', inject([RolePipe], (pipe: RolePipe) => {
        expect(pipe).toBeTruthy();
        expect(pipe.transform(UserRole.student)).toBe('Etudiant');
        expect(pipe.transform('non-existing-role')).toBe('');
    }));
});
