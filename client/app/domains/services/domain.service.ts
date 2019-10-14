import { Inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SITE } from '../../app.config';

import {
    CreateDomain,
    CreateDomainVariables,
    DeleteDomains,
    Domain,
    Domains,
    DomainsVariables,
    DomainVariables,
    Site,
    UpdateDomain,
    UpdateDomainVariables,
} from '../../shared/generated-types';
import { AbstractContextualizedService } from '../../shared/services/AbstractContextualizedService';
import { createDomain, deleteDomains, domainQuery, domainsQuery, updateDomain } from './domain.queries';

@Injectable({
    providedIn: 'root',
})
export class DomainService
    extends AbstractContextualizedService<Domain['domain'],
        DomainVariables,
        Domains['domains'],
        DomainsVariables,
        CreateDomain['createDomain'],
        CreateDomainVariables,
        UpdateDomain['updateDomain'],
        UpdateDomainVariables,
        DeleteDomains['deleteDomains']> {

    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo,
            'domain',
            domainQuery,
            domainsQuery,
            createDomain,
            updateDomain,
            deleteDomains,
            site);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            name: '',
            parent: null,
        };
    }

}
