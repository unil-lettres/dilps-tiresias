import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'lodash';
import { Subscription } from 'rxjs';
import { NetworkActivityService } from '../shared/services/network-activity.service';
import { UserService } from '../users/services/user.service';
import { TermsAgreementComponent } from './terms-agreement.component';

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

    constructor(private route: ActivatedRoute,
                private router: Router,
                public userService: UserService,
                private network: NetworkActivityService,
                public snackBar: MatSnackBar,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        const logout = this.route.snapshot.queryParams['logout'] || false;

        // Attempt to skip login if user is already logged in
        if (!logout) {
            this.currentUser = this.userService.getCurrentUser().subscribe(user => {
                if (user) {
                    if (!user.termsAgreement) {
                        this.showTerms(user);
                    } else {
                        this.redirect();
                    }                }
            });
        }

        // Watch errors
        this.network.errors.subscribe(errors => {
            if (errors.length) {
                this.loading = false;
                this.status = 'default';
                this.snackBar.open(errors[0].message, null, {
                    duration: 5000,
                    panelClass: ['snackbar-error'],
                });
            }
        });
    }

    ngOnDestroy(): void {
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
        this.userService.login(this.loginForm).subscribe((user) => {
            this.loading = false;
            if (!user.termsAgreement) {
                this.showTerms(user);
            } else {
                this.redirect();
            }
        });
    }

    private showTerms(user) {
        this.dialog.open(TermsAgreementComponent, {maxWidth: 700}).afterClosed().subscribe((accepted) => {
            if (accepted) {
                const date = {termsAgreement: (new Date()).toDateString()};
                this.userService.update(merge({}, user, date)).subscribe(u => {
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
