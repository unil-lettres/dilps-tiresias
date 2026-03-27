import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../users/services/user.service';
import {TermsAgreementComponent} from './terms-agreement.component';
import {finalize} from 'rxjs/operators';
import {SITE} from '../app.config';
import {Site, ViewerQuery} from '../shared/generated-types';
import {ColorScheme, formatIsoDateTime} from '@ecodev/natural';
import {CarouselComponent} from '../news/carousel/carousel.component';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatButton} from '@angular/material/button';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatDivider} from '@angular/material/divider';
import {LogoComponent} from '../shared/components/logo/logo.component';
import {ThemeService} from '../shared/services/theme.service';

@Component({
    selector: 'app-login',
    imports: [
        LogoComponent,
        MatDivider,
        MatGridList,
        MatGridTile,
        MatButton,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        FormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        CarouselComponent,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    protected readonly userService = inject(UserService);
    protected readonly dialog = inject(MatDialog);
    protected readonly snackBar = inject(MatSnackBar);
    protected readonly site = inject(SITE);
    protected readonly themeService = inject(ThemeService);

    protected readonly Site = Site;

    protected loading = false;

    protected baseUrl = window.location.origin;

    /**
     * Stores the received redirect URL until we need to use it (when login is successfull)
     */
    protected returnUrl = '/';

    protected loginForm = {
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
    protected login(): void {
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

    private showTerms(user: NonNullable<ViewerQuery['viewer']>): void {
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
    protected encodeUrl(url: string): string {
        return encodeURIComponent(url);
    }

    protected readonly ColorScheme = ColorScheme;
}
