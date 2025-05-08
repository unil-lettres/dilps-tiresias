import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    CardDomains,
    CardsVariables,
    CreateDomain,
    CreateDomainVariables,
    DeleteDomains,
    Domain,
    DomainInput,
    Domains,
    DomainsVariables,
    DomainVariables,
    UpdateDomain,
    UpdateDomainVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {cardDomainsQuery, createDomain, deleteDomains, domainQuery, domainsQuery, updateDomain} from './domain.queries';

@Injectable({
    providedIn: 'root',
})
export class DomainService extends AbstractContextualizedService<
    Domain['domain'],
    DomainVariables,
    Domains['domains'],
    DomainsVariables,
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

    public getForCards(variables: CardsVariables): Observable<CardDomains['cardDomains']> {
        return this.apollo
            .query<CardDomains, CardsVariables>({
                query: cardDomainsQuery,
                variables: variables,
            })
            .pipe(map(result => result.data.cardDomains));
    }
}
