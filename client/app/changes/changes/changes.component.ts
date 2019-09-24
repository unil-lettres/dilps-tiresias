import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AbstractList } from '../../shared/components/AbstractList';
import { ChangeService } from '../services/change.service';
import { UserService } from '../../users/services/user.service';

@Component({
    selector: 'app-changes',
    templateUrl: './changes.component.html',
    styleUrls: ['./changes.component.scss'],
})
export class ChangesComponent extends AbstractList {

    public displayedColumns = [
        'type',
        'original',
        'suggestion'
    ];

    constructor(service: ChangeService,
                router: Router,
                route: ActivatedRoute,
                dialog: MatDialog) {

        super('notifications', service, null, router, route, dialog);
    }

}
