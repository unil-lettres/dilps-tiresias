import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../users/services/user.service';
import { MatSnackBar } from '@angular/material';
import { NetworkActivityService } from '../shared/services/network-activity.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

    public loading = false;

    public status = 'default';

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
    private currentUser: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private network: NetworkActivityService,
        public snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        // Attempt to skip login if user is already logged in
        this.currentUser = this.userService.getCurrentUser().subscribe(user => {
            if (user) {
                this.redirect();
            }
        });

        // Watch errors
        this.network.errors.subscribe(errors => {
            if (errors.length) {
                this.loading = false;
                this.status = 'default';
                this.snackBar.open(errors[0].message, null, {
                    duration: 5000,
                    extraClasses: ['snackbar-error'],
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.currentUser.unsubscribe();
    }

    /**
     * Send mutation to log the user and redirect to home.
     */
    public login(): void {
        this.snackBar.dismiss();
        this.loading = true;
        this.status = 'loading';
        this.userService.login(this.loginForm).subscribe(() => {
            this.redirect();
            this.loading = false;
        });
    }

    /**
     * Redirect to home or redirect URL from GET params
     */
    private redirect(): void {
        this.router.navigate([this.returnUrl || '/']);
    }

}
