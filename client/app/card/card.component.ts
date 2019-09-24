import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ThemeService } from '../shared/services/theme.service';
import { CardService } from './services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { findKey, merge } from 'lodash';
import { InstitutionService } from '../institutions/services/institution.service';
import { AlertService } from '../shared/components/alert/alert.service';
import { ArtistService } from '../artists/services/artist.service';
import { ArtistComponent } from '../artists/artist/artist.component';
import { InstitutionComponent } from '../institutions/institution/institution.component';
import { ChangeService } from '../changes/services/change.service';
import { UploadService } from '../shared/services/upload.service';
import { CardVisibility, UserRole } from '../shared/generated-types';
import { CollectionSelectorComponent } from '../shared/components/collection-selector/collection-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../users/services/user.service';
import { DownloadComponent } from '../shared/components/download/download.component';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    providers: [UploadService],
})
export class CardComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public model;
    @Input() public hideToolbar = false;
    @Input() public hideImage = false;
    @Input() public hideCards = false;
    @Input() public hideTools = false;
    @Input() public title: string;
    @Input() public showLogo = false;

    @Input() public imageData;
    @Input() public imageSrc;
    @Input() public imageSrcFull;

    private edit = false;
    public visibility = 1;
    public visibilities = {
        1: {
            value: CardVisibility.private,
            text: 'par moi',
            color: null,
        },
        2: {
            value: CardVisibility.member,
            text: 'par les membres',
            color: 'accent',
        },
        3: {
            value: CardVisibility.public,
            text: 'par tout le monde',
            color: 'primary',
        },
    };

    public institutionComponent = InstitutionComponent;
    public artistComponent = ArtistComponent;
    private uploadSub;

    public institution;
    public artists;
    public user;

    @Input()
    set editable(val: boolean) {
        this.edit = val;
        this.updateUploadWatching();
    }

    constructor(private route: ActivatedRoute,
                private router: Router,
                private changeSvc: ChangeService,
                public themeSvc: ThemeService,
                public cardSvc: CardService,
                private alertSvc: AlertService,
                public artistService: ArtistService,
                public institutionSvc: InstitutionService,
                private uploadSvc: UploadService,
                private dialog: MatDialog,
                private userSvc: UserService) {
    }

    ngOnInit() {

        this.userSvc.getCurrentUser().subscribe(user => {
            this.user = user;
        });

        this.route.data.subscribe(data => this.showLogo = data.showLogo);

        if (this.model && !this.model.id) {
            // mass edit and create a change case
            this.initCard();
            this.edit = true;

        } else if (this.model && this.model.id) {
            this.initCard();

        } else {
            this.route.params.subscribe(params => {
                if (params.cardId) {
                    const card = this.route.snapshot.data['card'];
                    this.institution = card.institution;
                    this.model = merge({}, card);
                    this.initCard();
                } else if (!params.cardId && this.model && this.model.id) {
                    this.initCard();
                }
            });
        }

        this.updateUploadWatching();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initCard();
    }

    ngOnDestroy() {
        this.unwatchUpload();
    }

    public isEdit() {
        return this.edit;
    }

    public toggleEdit() {
        this.edit = !this.edit;
        this.updateUploadWatching();
    }

    public updateUploadWatching() {
        if (this.edit) {
            this.watchUpload();
        } else {
            this.unwatchUpload();
        }
    }

    public watchUpload() {
        this.uploadSub = this.uploadSvc.filesChanged.subscribe(files => {
            const file = files[files.length - 1];
            this.model.file = file;
            this.getBase64(file);
        });
    }

    public unwatchUpload() {
        if (this.uploadSub) {
            this.uploadSub.unsubscribe();
            this.uploadSub = null;
        }
    }

    private getBase64(file) {

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', (ev: any) => {
            this.imageData = btoa(ev.target.result);
        });
        reader.readAsBinaryString(file);
    }

    public initCard() {
        if (this.model) {

            // Init visibility
            this.visibility = +findKey(this.visibilities, (s) => {
                return s.value === this.model.visibility;
            });

            this.artists = this.model.artists;
            this.institution = this.model.institution;

            const src = CardService.getImageLink(this.model, 2000);
            if (src) {
                this.imageSrc = src;
            }

            const srcFull = CardService.getImageLink(this.model, null);
            if (srcFull) {
                this.imageSrcFull = srcFull;
            }
        }
    }

    public updateVisibility(ev) {
        this.model.visibility = this.visibilities[ev.value].value;
    }

    public onSubmit() {
        if (this.model.id) {
            this.update();
        } else {
            this.create();
        }
    }

    public update() {
        this.cardSvc.update(this.model).subscribe((card: any) => {
            this.alertSvc.info('Mis à jour');
            this.institution = card.institution;
            this.artists = card.artists;
            this.edit = false;
        });
    }

    public create() {
        this.cardSvc.create(this.model).subscribe(card => {
            this.alertSvc.info('Créé');
            this.router.navigate([
                '..',
                card.id,
            ], {relativeTo: this.route});
        });
    }

    public confirmDelete() {
        this.alertSvc.confirm('Suppression', 'Voulez-vous supprimer définitivement cet élément ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.cardSvc.delete(this.model).subscribe(() => {
                        this.alertSvc.info('Supprimé');
                        this.router.navigateByUrl('/');
                    });
                }
            });
    }

    public suggestUpdate() {
        this.router.navigateByUrl('notification/new/' + this.model.id);
    }

    public suggestDeletion() {
        this.changeSvc.suggestDeletion(this.model).subscribe(() => {
            this.router.navigateByUrl('notification');
        });
    }

    public suggestCreation() {
        this.changeSvc.suggestCreation(this.model).subscribe(() => {
            this.router.navigateByUrl('notification');
        });
    }

    public linkToCollection() {

        this.dialog.open(CollectionSelectorComponent, {
            width: '400px',
            position: {
                top: '74px',
                left: '74px',
            },
            data: {
                images: [this.model],
            },
        });
    }

    public validateData() {
        this.cardSvc.validateData(this.model).subscribe(() => {
            this.alertSvc.info('Donnée validée');
        });
    }

    public validateImage() {
        this.cardSvc.validateImage(this.model).subscribe(() => {
            this.alertSvc.info('Image validée');
        });
    }

    public download(card) {
        this.dialog.open(DownloadComponent, {
            width: '400px',
            data: {
                images: [card],
                denyLegendsDownload: !this.user,
            },
        });
    }

    public goToCard(card) {
        this.router.navigateByUrl('/card/' + card.id);
    }

    public getSuggestAddLabel() {
        if (this.user.role === UserRole.junior || this.user.role === UserRole.senior) {
            return 'Soumettre';
        }

        return 'Suggérer l\'ajout';
    }

    public canSuggestCreate() {
        return this.user && this.model.creator
               && this.model.owner.id === this.user.id
               && this.model.creator.id === this.user.id
               && this.model.visibility === CardVisibility.private;
    }

    public canSuggestUpdate() {
        return this.user && this.model.owner && this.user.id !== this.model.owner.id || this.model.visibility !== CardVisibility.private;
    }

    public canSuggestDelete() {
        return this.canSuggestUpdate();
    }
}
