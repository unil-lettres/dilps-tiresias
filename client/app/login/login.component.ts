import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {merge} from 'lodash';
import {Subscription} from 'rxjs';
import {UserService} from '../users/services/user.service';
import {TermsAgreementComponent} from './terms-agreement.component';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    public loading = false;

    public status = 'default';
    public baseUrl = window.location.origin;

    /**
     * Stores the received redirect URL until we need to use it (when login is successfull)
     */
    public returnUrl: string;

    public loginForm = {
        login: '',
        password: '',
    };

    /**
     * Subscription to the logged in user observable
     */
    private currentUser: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public userService: UserService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
    ) {}

    public ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/login';
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
        if (this.currentUser) {
            this.currentUser.unsubscribe();
        }
    }

    /**
     * Send mutation to log the user and redirect to home.
     */
    public login(): void {
        this.snackBar.dismiss();
        this.loading = true;
        this.status = 'loading';
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

    private showTerms(user): void {
        this.dialog
            .open(TermsAgreementComponent, {maxWidth: 700})
            .afterClosed()
            .subscribe(accepted => {
                if (accepted) {
                    const date = {termsAgreement: new Date().toDateString()};
                    this.userService.updateNow(merge({}, user, date)).subscribe(u => {
                        this.redirect();
                    });
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
    public encodeUrl(url): string {
        return encodeURIComponent(url);
    }
}
