import {TestBed} from '@angular/core/testing';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {provideRouter} from '@angular/router';
import {LOCAL_STORAGE, NaturalMemoryStorage} from '@ecodev/natural';
import {of} from 'rxjs';
import {SITE} from '../../shared/config/site';
import {Site, UserRole, type ViewerQuery} from '../../shared/generated-types';
import {MOCK_APOLLO_PROVIDER} from '../../shared/testing/MockApolloProvider';
import {UserService} from '../services/user.service';
import {UserComponent} from './user.component';

type Testable = {
    roleDisabled: (role: UserRole) => boolean;
    canEditAdministrativeFields: () => boolean;
};

describe('UserComponent', () => {
    let getUserRolesAvailable: ReturnType<typeof vi.fn>;

    function create(item: Record<string, unknown>, viewerRole: UserRole): UserComponent {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                provideNativeDateAdapter(),
                MOCK_APOLLO_PROVIDER,
                {provide: SITE, useValue: Site.Dilps},
                {provide: LOCAL_STORAGE, useClass: NaturalMemoryStorage},
                {provide: MAT_DIALOG_DATA, useValue: {item}},
                {provide: MatDialogRef, useValue: {close: vi.fn()}},
            ],
        });

        const userService = TestBed.inject(UserService);
        vi.spyOn(userService, 'getCurrentUser').mockReturnValue(
            of({id: '1000', role: viewerRole} as ViewerQuery['viewer']),
        );
        getUserRolesAvailable = vi
            .spyOn(userService, 'getUserRolesAvailable')
            .mockReturnValue(of([UserRole.student, UserRole.junior, UserRole.senior]));

        const fixture = TestBed.createComponent(UserComponent);
        fixture.detectChanges();

        return fixture.componentInstance;
    }

    function testable(component: UserComponent): Testable {
        return component as unknown as Testable;
    }

    it('enables only the roles that the viewer may give to an existing user', async () => {
        const component = create({id: '1003'}, UserRole.administrator);
        await vi.waitFor(() => expect(getUserRolesAvailable).toHaveBeenCalled());

        expect(testable(component).roleDisabled(UserRole.senior)).toBe(false);
        expect(testable(component).roleDisabled(UserRole.administrator)).toBe(true);
    });

    it('enables the roles that the viewer may give to a new user', () => {
        const component = create({}, UserRole.administrator);

        expect(testable(component).roleDisabled(UserRole.senior)).toBe(false);
    });

    it('lets only administrators change the email and the end of access', () => {
        expect(testable(create({}, UserRole.administrator)).canEditAdministrativeFields()).toBe(true);
        TestBed.resetTestingModule();
        expect(testable(create({}, UserRole.senior)).canEditAdministrativeFields()).toBe(false);
    });

    describe('password confirmation', () => {
        function passwords(component: UserComponent): {
            password: {setValue: (value: string) => void};
            confirmation: {setValue: (value: string) => void; hasError: (error: string) => boolean};
        } {
            const literal = component as unknown as {
                passwordCtrl: {setValue: (value: string) => void};
                passwordConfirmationCtrl: {setValue: (value: string) => void; hasError: (error: string) => boolean};
            };

            return {password: literal.passwordCtrl, confirmation: literal.passwordConfirmationCtrl};
        }

        it('refuses a confirmation different from the password', () => {
            const {password, confirmation} = passwords(create({}, UserRole.administrator));

            password.setValue('secret');
            confirmation.setValue('secrets');
            expect(confirmation.hasError('password')).toBe(true);

            confirmation.setValue('secret');
            expect(confirmation.hasError('password')).toBe(false);
        });

        it('gives the password to the user', () => {
            const component = create({}, UserRole.administrator);

            passwords(component).password.setValue('secret');

            expect(component.data.item.password).toBe('secret');
        });

        it('accepts the confirmation once the password is fixed to match it', () => {
            const {password, confirmation} = passwords(create({}, UserRole.administrator));

            password.setValue('secret');
            confirmation.setValue('secrets');
            password.setValue('secrets');

            expect(confirmation.hasError('password')).toBe(false);
        });
    });
});
