import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    CardDomainsQuery,
    CardsQueryVariables,
    CreateDomain,
    CreateDomainVariables,
    DeleteDomains,
    DomainQuery,
    DomainInput,
    DomainsQuery,
    DomainsQueryVariables,
    DomainQueryVariables,
    UpdateDomain,
    UpdateDomainVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {cardDomainsQuery, createDomain, deleteDomains, domainQuery, domainsQuery, updateDomain} from './domain.queries';

@Injectable({
    providedIn: 'root',
})
export class DomainService extends AbstractContextualizedService<
    DomainQuery['domain'],
    DomainQueryVariables,
    DomainsQuery['domains'],
    DomainsQueryVariables,
    CreateDomain['createDomain'],
    CreateDomainVariables,
    UpdateDomain['updateDomain'],
    UpdateDomainVariables,
    DeleteDomains['deleteDomains'],
    never
> {
    public constructor() {
        super('domain', domainQuery, domainsQuery, createDomain, updateDomain, deleteDomains);
    }

    public override getDefaultForServer(): DomainInput {
        return {
            name: '',
            parent: null,
            site: this.site,
        };
    }

    public getForCards(variables: CardsQueryVariables): Observable<CardDomainsQuery['cardDomains']> {
        return this.apollo
            .query<CardDomainsQuery, CardsQueryVariables>({
                query: cardDomainsQuery,
                variables: variables,
            })
            .pipe(map(result => result.data.cardDomains));
    }
}
