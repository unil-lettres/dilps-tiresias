import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, NavigationEnd, Router, RouteReuseStrategy} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, concatMap, filter, finalize, takeUntil, tap} from 'rxjs/operators';
import {AppRouteReuseStrategy} from '../app-route-reuse-strategy';
import {SITE} from '../app.config';
import {CardService} from '../card/services/card.service';
import {AlertService} from '../shared/components/alert/alert.service';
import {
    CollectionSelectorComponent,
    CollectionSelectorData,
    CollectionSelectorResult,
} from '../shared/components/collection-selector/collection-selector.component';
import {CardInput, Site, UserRole, Viewer_viewer} from '../shared/generated-types';
import {NetworkActivityService} from '../shared/services/network-activity.service';
import {ThemeService} from '../shared/services/theme.service';
import {UserService} from '../users/services/user.service';
import {UserComponent} from '../users/user/user.component';
import {FileSelection, NaturalAbstractController} from '@ecodev/natural';
import {WelcomeComponent} from './welcome.component';

function isExcel(file: File): boolean {
    return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends NaturalAbstractController implements OnInit, OnDestroy {
    public Site = Site;

    public errors: (Error & {debugMessage?: string; category?: string})[] = [];
    public user: Viewer_viewer | null = null;
    public nav = 1;
    public progress?: number = null;
    private uploaded = 0;

    public constructor(
        public readonly themeService: ThemeService,
        public readonly route: ActivatedRoute,
        public readonly router: Router,
        public readonly userService: UserService,
        private readonly network: NetworkActivityService,
        private readonly snackBar: MatSnackBar,
        private readonly alertService: AlertService,
        private readonly dialog: MatDialog,
        private readonly cardService: CardService,
        @Inject(SITE) public readonly site: Site,
        private readonly routeReuse: RouteReuseStrategy,
    ) {
        super();
        this.network.errors.next([]);
    }

    public ngOnInit(): void {
        // Watch errors
        this.network.errors.pipe(takeUntil(this.ngUnsubscribe)).subscribe(errors => {
            this.errors = this.errors.concat(errors);
        });

        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;
        });

        this.route.firstChild.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
            if (params.nav && /^[01]$/.test(params.nav)) {
                this.nav = +params.nav;
            }
        });

        this.router.events
            .pipe(
                takeUntil(this.ngUnsubscribe),
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe(() => {
                document.querySelectorAll('.mat-sidenav-content, .scrollable').forEach(i => i.scroll({top: 0}));
            });

        // Welcome dialog would be shown to visitors once per session
        if (this.userService.hasTempAccess() && sessionStorage.getItem('welcomed') !== 'true') {
            this.showWelcome();
        }
    }

    public uploadImages(selection: FileSelection): void {
        const files = selection.valid;
        const excel = files.find(isExcel);
        if (excel) {
            this.uploadImagesAndExcel(
                excel,
                files.filter(f => !isExcel(f)),
            );
        } else {
            this.uploadImagesOnly(files);
        }
    }

    public uploadImagesOnly(files: File[]): void {
        const inputs = files.map(file => {
            const card = this.cardService.getConsolidatedForClient() as CardInput;
            card.file = file;

            return card;
        });

        const requireCollection = this.site === Site.tiresias;
        const collection$ = requireCollection ? this.selectCollection() : of(undefined);
        collection$.subscribe(collection => {
            // Don't do anything if don't have a required collection
            if (requireCollection && !collection) {
                return;
            }

            const total = inputs.length;
            if (!total) {
                return;
            }

            let errors = 0;

            this.progress = 0;
            this.snackBar.open("L'upload est en cours, ne fermez pas votre navigateur", 'Compris', {
                duration: 10000,
                verticalPosition: 'top',
                horizontalPosition: 'end',
            });

            of(...inputs)
                .pipe(
                    concatMap(input => {
                        return this.cardService.createWithCollection(input, collection).pipe(
                            catchError(() => {
                                errors++;

                                return EMPTY;
                            }),
                            tap(() => {
                                this.uploaded++;
                                this.progress = (this.uploaded / total) * 100;
                            }),
                        );
                    }),
                    finalize(() => {
                        if (errors) {
                            const message =
                                total -
                                errors +
                                '/' +
                                total +
                                ' images ont été uploadées. Voir détail dans la pastille en bas à gauche';

                            this.snackBar.open(message, 'Compris', {
                                duration: 15000,
                                panelClass: ['snackbar-error'],
                                verticalPosition: 'top',
                                horizontalPosition: 'end',
                            });
                        } else {
                            this.alertService.info("L'upload est terminé");
                        }

                        this.progress = null;
                        this.uploaded = 0;
                        this.redirectAfterCreation(collection); // we want it before upload has ended
                    }),
                )
                .subscribe();
        });
    }

    public uploadImagesAndExcel(excel: File, images: File[]): void {
        this.selectCollection().subscribe(collection => {
            this.cardService.createWithExcel(excel, images, collection).subscribe(() => {
                this.redirectAfterCreation(collection);
            });
        });
    }

    private redirectAfterCreation(collection?: CollectionSelectorResult): void {
        const url = collection ? 'my-collection/' + collection.id : 'my-collection/my-cards';
        this.router.navigateByUrl('/empty', {skipLocationChange: true}).then(() => {
            this.router.navigateByUrl(url).then(() => {
                (this.routeReuse as AppRouteReuseStrategy).clearHandlers();
            });
        });
    }

    private selectCollection(): Observable<CollectionSelectorResult | undefined> {
        return this.dialog
            .open<CollectionSelectorComponent, CollectionSelectorData, CollectionSelectorResult>(
                CollectionSelectorComponent,
                {
                    width: '400px',
                    data: {},
                },
            )
            .afterClosed();
    }

    public editUser(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.dialog.open(UserComponent, {
                width: '800px',
                data: {item: user},
            });
        });
    }

    public showNavigationMenu(): boolean {
        return !!this.nav;
    }

    public showThesaurusMenu(): boolean {
        const dilpsRoles = [UserRole.administrator, UserRole.senior, UserRole.major, UserRole.junior];
        const tiresiasRoles = [UserRole.administrator];
        const applicableRoles = this.site === Site.dilps ? dilpsRoles : tiresiasRoles;

        return applicableRoles.includes(this.user.role);
    }

    private showWelcome(): void {
        this.dialog
            .open(WelcomeComponent, {maxWidth: 500})
            .afterClosed()
            .subscribe(login => {
                sessionStorage.setItem('welcomed', 'true');

                if (login) {
                    this.router.navigateByUrl('/login');
                }
            });
    }

    public mailto(): void {
        document.location.href = 'mailto:' + this.contact();
    }

    public contact(): string {
        switch (this.site) {
            case Site.tiresias:
                return 'tiresias@unil.ch';
            case Site.dilps:
            default:
                return 'infra-lettres@unil.ch';
        }
    }
}
