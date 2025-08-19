import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../users/services/user.service';
import {TermsAgreementComponent} from './terms-agreement.component';
import {finalize} from 'rxjs/operators';
import {SITE} from '../app.config';
import {Site, Viewer} from '../shared/generated-types';
import {formatIsoDateTime} from '@ecodev/natural';
import {CarouselComponent} from '../news/carousel/carousel.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {LogoComponent} from '../shared/components/logo/logo.component';
import {ThemeService} from '../shared/services/theme.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [
        LogoComponent,
        MatDividerModule,
        MatGridListModule,
        MatButtonModule,
        MatExpansionModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        CarouselComponent,
    ],
})
export class LoginComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    public readonly userService = inject(UserService);
    public readonly dialog = inject(MatDialog);
    public readonly snackBar = inject(MatSnackBar);
    public readonly site = inject(SITE);
    public readonly themeService = inject(ThemeService);

    public Site = Site;

    public loading = false;

    public baseUrl = window.location.origin;

    /**
     * Stores the received redirect URL until we need to use it (when login is successfull)
     */
    public returnUrl = '/';

    public loginForm = {
        login: '',
        password: '',
    };

    /**
     * Subscription to the logged in user observable
     */
    private currentUser: Subscription | null = null;

    public ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
        const logout = this.route.snapshot.queryParams.logout || false;

        // Attempt to skip login if user is already logged in
        if (!logout) {
            this.currentUser = this.userService.getCurrentUser().subscribe(user => {
                if (user) {
                    if (!user.termsAgreement) {
                        this.showTerms(user);
                    } else {
                        this.redirect();
                    }
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.currentUser?.unsubscribe();
    }

    /**
     * Send mutation to log the user and redirect to home.
     */
    public login(): void {
        this.snackBar.dismiss();
        this.loading = true;
        this.userService
            .login(this.loginForm)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(user => {
                if (!user.termsAgreement) {
                    this.showTerms(user);
                } else {
                    this.redirect();
                }
            });
    }

    private showTerms(user: NonNullable<Viewer['viewer']>): void {
        this.dialog
            .open(TermsAgreementComponent, {maxWidth: 700})
            .afterClosed()
            .subscribe(accepted => {
                if (accepted) {
                    this.userService
                        .updateNow({
                            id: user.id,
                            termsAgreement: formatIsoDateTime(new Date()),
                        })
                        .subscribe(() => this.redirect());
                } else {
                    this.userService.logout();
                }
            });
    }

    /**
     * Redirect to home or redirect URL from GET params
     */
    private redirect(): void {
        this.router.navigateByUrl(this.returnUrl || '/');
    }

    /**
     * Serializes and parses an URL to encode it.
     */
    public encodeUrl(url: string): string {
        return encodeURIComponent(url);
    }
}
