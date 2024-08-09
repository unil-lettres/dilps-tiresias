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
            return 'Page 1 de 1';
        }
        const amountPages = Math.ceil(length / pageSize);
        return `Page ${page + 1} de ${amountPages}`;
    }
}
