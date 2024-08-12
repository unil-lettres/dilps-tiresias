import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CustomPaginatorIntl implements MatPaginatorIntl {
    public changes = new Subject<void>();

    public firstPageLabel = 'Première page';
    public itemsPerPageLabel = 'Éléments par page:';
    public lastPageLabel = 'Dernière page';

    public nextPageLabel = 'Page suivante';
    public previousPageLabel = 'Page précédente';

    public getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return '0';
        }
        const from = Math.max(page * pageSize, 1);
        const to = Math.min((page + 1) * pageSize, length);
        return `${from} - ${to} de ${length}`;
    }
}
