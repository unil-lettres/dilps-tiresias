import { forkJoin } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../shared/services/theme.service';
import { UserService } from '../users/services/user.service';
import { NetworkActivityService } from '../shared/services/network-activity.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from '../shared/components/alert/alert.service';
import { UserComponent } from '../users/user/user.component';
import { UploadService } from '../shared/services/upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../card/services/card.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    private routeParamsSub;

    public environmentString = environment.environment;
    public errors = [];
    public user;
    public nav = 1;

    constructor(public themeSvc: ThemeService,
                public route: ActivatedRoute,
                public router: Router,
                public userSvc: UserService,
                private network: NetworkActivityService,
                private snackBar: MatSnackBar,
                private alertSvc: AlertService,
                private dialog: MatDialog,
                public uploadSvc: UploadService,
                private cardSvc: CardService) {

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
                this.alertSvc.error('Quelque chose s\'est mal passé !');
            }
        });

        this.userSvc.getCurrentUser().subscribe(user => {
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
            const card = this.cardSvc.getEmptyObject();
            card.file = file;
            observables.push(this.cardSvc.create(card));
        }
        files.length = 0;
        forkJoin(observables).subscribe(() => {
            this.router.navigateByUrl('my-collection;upload=' + Date.now());
        });

        files.length = 0;
    }

    public editUser() {
        this.userSvc.getCurrentUser().subscribe(user => {
            this.dialog.open(UserComponent, {
                width: '800px',
                data: {item: user},
            });
        });
    }

    public showNavigationMenu() {
        return !!this.nav;
    }

    public environmentColor() {
        switch (this.environmentString) {
            case 'development':
                return '#2ca02c';
            case 'staging':
                return '#ee7f00';
            default:
                return '';
        }
    }
}
