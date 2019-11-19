import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SITE } from '../app.config';
import { CardService } from '../card/services/card.service';
import { AlertService } from '../shared/components/alert/alert.service';
import { CardInput, Collections_collections_items, Site } from '../shared/generated-types';
import { NetworkActivityService } from '../shared/services/network-activity.service';
import { ThemeService } from '../shared/services/theme.service';
import { UserService } from '../users/services/user.service';
import { UserComponent } from '../users/user/user.component';
import {
    CollectionSelectorComponent,
    CollectionSelectorData,
    CollectionSelectorResult,
} from '../shared/components/collection-selector/collection-selector.component';

function isExcel(file: File): boolean {
    return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

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

    public uploadImages(files: File[]): void {
        const excel = files.find(isExcel);
        if (excel) {
            this.uploadImagesAndExcel(excel, files.filter(f => !isExcel(f)));
        } else {
            this.uploadImagesOnly(files);
        }

        files.length = 0;
    }

    public uploadImagesOnly(files: File[]): void {
        const observables = [];
        for (const file of files) {
            const card = this.cardService.getConsolidatedForClient();
            card.file = file;
            observables.push(this.cardService.create(card as CardInput));
        }
        files.length = 0;
        forkJoin(observables).subscribe(() => {
            this.router.navigateByUrl('/empty', {skipLocationChange: true})
                .then(() => this.router.navigateByUrl('my-collection'));
        });
    }

    public uploadImagesAndExcel(excel: File, images: File[]): void {
        this.dialog.open<CollectionSelectorComponent, CollectionSelectorData, CollectionSelectorResult>(CollectionSelectorComponent, {
            width: '400px',
            data: {},
        }).afterClosed().subscribe(collection => {

            this.cardService.createWithExcel(excel, images, collection).subscribe(() => {
                this.router.navigateByUrl('/empty', {skipLocationChange: true})
                    .then(() => this.router.navigateByUrl('my-collection/' + collection.id));
            });
        });

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
