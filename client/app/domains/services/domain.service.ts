import {Injectable} from '@angular/core';
import {type Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    type CardDomainsQuery,
    type CardsQueryVariables,
    type CreateDomain,
    type CreateDomainVariables,
    type DeleteDomains,
    type DomainQuery,
    type DomainInput,
    type DomainsQuery,
    type DomainsQueryVariables,
    type DomainQueryVariables,
    type UpdateDomain,
    type UpdateDomainVariables,
    type DeleteDomainsVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {cardDomainsQuery, createDomain, deleteDomains, domainQuery, domainsQuery, updateDomain} from './domain.queries';
import {ignoreErrors} from '@ecodev/natural';

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
    DeleteDomainsVariables
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
            .pipe(
                ignoreErrors(),
                map(result => result.data.cardDomains),
            );
    }
}
