import {Injectable} from '@angular/core';
import {
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
import {createDomain, deleteDomains, domainQuery, domainsQuery, updateDomain} from './domain.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

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
}
