import {Inject, Injectable} from '@angular/core';
import {
    CreateDomain,
    CreateDomainVariables,
    DeleteDomains,
    Domain,
    DomainInput,
    Domains,
    DomainsVariables,
    DomainVariables,
    Site,
    UpdateDomain,
    UpdateDomainVariables,
} from '../../shared/generated-types';
import {createDomain, deleteDomains, domainQuery, domainsQuery, updateDomain} from './domain.queries';
import {SITE} from '../../app.config';
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
    public constructor(@Inject(SITE) site: Site) {
        super('domain', domainQuery, domainsQuery, createDomain, updateDomain, deleteDomains, site);
    }

    public override getDefaultForServer(): DomainInput {
        return {
            name: '',
            parent: null,
            site: this.site,
        };
    }
}
