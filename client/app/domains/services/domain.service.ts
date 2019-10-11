import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    Domain,
    Domains,
    DomainsVariables,
    DomainVariables,
    CreateDomain,
    CreateDomainVariables,
    DeleteDomains,
    UpdateDomain,
    UpdateDomainVariables,
} from '../../shared/generated-types';
import { domainQuery, domainsQuery, createDomain, deleteDomains, updateDomain } from './domain.queries';
import { NaturalAbstractModelService } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class DomainService
    extends NaturalAbstractModelService<Domain['domain'],
        DomainVariables,
        Domains['domains'],
        DomainsVariables,
        CreateDomain['createDomain'],
        CreateDomainVariables,
        UpdateDomain['updateDomain'],
        UpdateDomainVariables,
        DeleteDomains['deleteDomains']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'domain',
            domainQuery,
            domainsQuery,
            createDomain,
            updateDomain,
            deleteDomains);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            name: '',
        };
    }

}
