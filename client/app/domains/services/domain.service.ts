import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';

import {
    CreateDomain,
    CreateDomainVariables,
    DeleteDomains,
    Domain, DomainInput,
    Domains,
    DomainsVariables,
    DomainVariables,
    UpdateDomain,
    UpdateDomainVariables,
} from '../../shared/generated-types';
import { createDomain, deleteDomains, domainQuery, domainsQuery, updateDomain } from './domain.queries';

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

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): DomainInput {
        return {
            name: '',
            parent: null,
        };
    }

}
