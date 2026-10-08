import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {LOCAL_STORAGE, NaturalMemoryStorage, type NaturalSearchFacets} from '@ecodev/natural';
import {SITE} from './config/site';
import {Site} from './generated-types';
import {addAdminFacets, adminFacets, dilps, tiresias} from './natural-search-facets';
import {MOCK_APOLLO_PROVIDER} from './testing/MockApolloProvider';

describe('natural search facets', () => {
    function facets(site: Site): NaturalSearchFacets {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                MOCK_APOLLO_PROVIDER,
                {provide: SITE, useValue: site},
                {provide: LOCAL_STORAGE, useClass: NaturalMemoryStorage},
            ],
        });

        return TestBed.runInInjectionContext(() => (site === Site.Dilps ? dilps() : tiresias()));
    }

    function names(list: NaturalSearchFacets): string[] {
        return list.map(facet => facet.display);
    }

    it('searches Dilps, and may include Tiresias', () => {
        expect(names(facets(Site.Dilps))).toEqual([
            'Titre',
            'Artistes',
            'Auteur technique',
            'Supplément',
            'Datation',
            'Domaines',
            'Technique & Matériel',
            'Localité',
            'Institution',
            'Source',
            '[Inclure Tiresias]',
        ]);
    });

    it('searches Tiresias, and may include Dilps', () => {
        expect(names(facets(Site.Tiresias))).toEqual([
            '[Inclure Dilps]',
            'Fonds',
            'Domaine',
            'Description',
            'Corpus',
            'Matériaux',
            'Mots-clés',
            'Localité',
            'Géolocalisation',
            'Nom antique',
            'Période',
            'Datation',
            'Musée',
            "Numéro d'inventaire",
            'Type de document',
            'Année du document',
            'Source',
        ]);
    });

    it('adds the facets of administrators before the flag to include Tiresias, once', () => {
        const list = facets(Site.Dilps);

        addAdminFacets(list, Site.Dilps);
        addAdminFacets(list, Site.Dilps);

        expect(names(list).slice(-3)).toEqual(['Source', 'Visibilité', '[Inclure Tiresias]']);
        expect(list.filter(facet => facet === adminFacets[0])).toHaveLength(1);
    });

    it('adds the facets of administrators at the end on Tiresias', () => {
        const list = facets(Site.Tiresias);

        addAdminFacets(list, Site.Tiresias);

        expect(names(list).slice(-2)).toEqual(['Source', 'Visibilité']);
    });
});
