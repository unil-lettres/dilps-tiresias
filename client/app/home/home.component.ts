import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SITE } from '../app.config';
import { CardService } from '../card/services/card.service';
import { AlertService } from '../shared/components/alert/alert.service';
import { Site } from '../shared/generated-types';
import { NetworkActivityService } from '../shared/services/network-activity.service';
import { ThemeService } from '../shared/services/theme.service';
import { UserService } from '../users/services/user.service';
import { UserComponent } from '../users/user/user.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

    public Site = Site;

    public errors = [];
    public user;
    public nav = 1;
    private routeParamsSub;

    constructor(public themeService: ThemeService,
                public route: ActivatedRoute,
                public router: Router,
                public userService: UserService,
                private network: NetworkActivityService,
                private snackBar: MatSnackBar,
                private alertService: AlertService,
                private dialog: MatDialog,
                private cardService: CardService,
                @Inject(SITE) public site: Site) {

        this.network.errors.next([]);
    }

    ngOnDestroy() {
        this.routeParamsSub.unsubscribe();
    }

    ngOnInit() {
        // Watch errors
        this.network.errors.subscribe(errors => {
            this.errors = this.errors.concat(errors);
            if (errors.length) {
                this.alertService.error('Quelque chose s\'est mal passé !');
            }
        });

        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;
        });

        this.routeParamsSub = this.route.firstChild.params.subscribe(params => {
            if (params.nav && /^[01]$/.test(params.nav)) {
                this.nav = +params.nav;
            }
        });
    }

    public uploadPhoto(files) {
        const observables = [];
        for (const file of files) {
            const card = this.cardService.getConsolidatedForClient();
            card.file = file;
            observables.push(this.cardService.create(card));
        }
        files.length = 0;
        forkJoin(observables).subscribe(() => {
            this.router.navigateByUrl('/empty', {skipLocationChange: true})
                .then(() => this.router.navigateByUrl('my-collection'));
        });

        files.length = 0;
    }

    public editUser() {
        this.userService.getCurrentUser().subscribe(user => {
            this.dialog.open(UserComponent, {
                width: '800px',
                data: {item: user},
            });
        });
    }

    public showNavigationMenu() {
        return !!this.nav;
    }

}
