import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, omit } from 'lodash';
import { CardService } from '../../card/services/card.service';
import { CardVisibility } from '../../shared/generated-types';
import { UserService } from '../../users/services/user.service';
import { ChangeService } from '../services/change.service';

@Component({
    selector: 'app-change',
    templateUrl: './change.component.html',
    styleUrls: ['./change.component.scss'],
})
export class ChangeComponent implements OnInit {

    public change;
    public original;
    public suggestion;
    public suggestionImageSrc;
    public suggestionImageSrcFull;
    public loaded = false;
    public user;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private changeService: ChangeService,
                private cardService: CardService,
                private userService: UserService) {
    }

    ngOnInit() {

        this.userService.getCurrentUser().subscribe(user => this.user = user);

        if (this.route.snapshot.params['changeId']) {
            this.changeService.getOne(this.route.snapshot.params['changeId']).subscribe(change => {
                this.change = merge({}, change);
                this.suggestionImageSrcFull = CardService.getImageLink(this.change.original, null);
                this.suggestionImageSrc = CardService.getImageLink(this.change.original, 2000);
                this.loaded = true;
            });
        } else if (this.route.snapshot.params['cardId']) {
            this.cardService.getOne(this.route.snapshot.params['cardId']).subscribe(card => {
                this.original = merge({}, card);
                this.suggestion = omit(merge({}, card, {original: card}), 'id');
                this.suggestion.visibility = CardVisibility.private;
                this.suggestionImageSrcFull = CardService.getImageLink(card, null);
                this.suggestionImageSrc = CardService.getImageLink(card, 2000);
                this.loaded = true;
            });
        } else {
            this.suggestion = {};
            this.loaded = true;
        }
    }

    public accept() {
        this.changeService.acceptChange(this.change).subscribe(card => {
            if (card) {
                this.router.navigateByUrl('card/' + card.id);
            } else {
                this.router.navigateByUrl('notification');
            }
        });
    }

    public reject() {
        this.changeService.rejectChange(this.change).subscribe(() => {
            this.router.navigate([
                '..',
                'notification',
            ]);
        });
    }

    public update() {
        this.cardService.create(this.suggestion).subscribe((card: { id }) => {
            this.changeService.suggestUpdate(card).subscribe(() => {
                this.router.navigateByUrl('notification');
            });
        });
    }

    public create() {
        this.cardService.create(this.suggestion).subscribe((card: { id }) => {
            this.changeService.suggestCreation(card).subscribe(() => {
                this.router.navigateByUrl('notification');
            });
        });
    }

}
