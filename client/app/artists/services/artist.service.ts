import {Injectable} from '@angular/core';
import {
    ArtistQuery,
    ArtistInput,
    ArtistsQuery,
    ArtistsQueryVariables,
    ArtistQueryVariables,
    CreateArtist,
    CreateArtistVariables,
    DeleteArtists,
    UpdateArtist,
    UpdateArtistVariables,
} from '../../shared/generated-types';
import {artistQuery, artistsQuery, createArtist, deleteArtists, updateArtist} from './artist.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

@Injectable({
    providedIn: 'root',
})
export class ArtistService extends AbstractContextualizedService<
    ArtistQuery['artist'],
    ArtistQueryVariables,
    ArtistsQuery['artists'],
    ArtistsQueryVariables,
    CreateArtist['createArtist'],
    CreateArtistVariables,
    UpdateArtist['updateArtist'],
    UpdateArtistVariables,
    DeleteArtists['deleteArtists'],
    never
> {
    public constructor() {
        super('artist', artistQuery, artistsQuery, createArtist, updateArtist, deleteArtists);
    }

    public override getDefaultForServer(): ArtistInput {
        return {
            name: '',
            site: this.site,
        };
    }
}
