import { OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IncrementSubject } from '../services/increment-subject';
import { PaginatedDataSource } from '../services/paginated.data.source';

export class AbstractList implements OnInit {

    public displayedColumns = [
        'name',
    ];

    public dataSource;

    protected listingOptions = new IncrementSubject({});

    constructor(private key,
                protected service,
                private component,
                protected router: Router,
                protected route: ActivatedRoute,
                protected dialog: MatDialog) {
    }

    ngOnInit() {
        const queryRef = this.service.watchAll(this.listingOptions);
        this.dataSource = new PaginatedDataSource(
            queryRef.valueChanges,
            this.listingOptions,
            {},
            true,
            this.router,
            this.route,
            this.key,
        );
    }

    public edit(item) {
        this.dialog.open(this.component, {
            width: '800px',
            data: {item: item},
        });
    }

    public add() {
        this.dialog.open(this.component, {
            width: '800px',
        });
    }
}
