import {Apollo} from 'apollo-angular';
import {Injectable, Inject} from '@angular/core';
import {
    Artist,
    ArtistInput,
    Artists,
    ArtistsVariables,
    ArtistVariables,
    CreateArtist,
    CreateArtistVariables,
    DeleteArtists,
    Site,
    UpdateArtist,
    UpdateArtistVariables,
} from '../../shared/generated-types';
import {artistQuery, artistsQuery, createArtist, deleteArtists, updateArtist} from './artist.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {SITE} from '../../app.config';

@Injectable({
    providedIn: 'root',
})
export class ArtistService extends AbstractContextualizedService<
    Artist['artist'],
    ArtistVariables,
    Artists['artists'],
    ArtistsVariables,
    CreateArtist['createArtist'],
    CreateArtistVariables,
    UpdateArtist['updateArtist'],
    UpdateArtistVariables,
    DeleteArtists['deleteArtists'],
    never
> {
    public constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo, 'artist', artistQuery, artistsQuery, createArtist, updateArtist, deleteArtists, site);
    }

    public getDefaultForClient(): ArtistInput {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): ArtistInput {
        return {
            name: '',
            site: this.site,
        };
    }
}
