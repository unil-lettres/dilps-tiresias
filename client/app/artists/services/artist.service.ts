import {Service} from '@angular/core';
import {
    type ArtistQuery,
    type ArtistInput,
    type ArtistsQuery,
    type ArtistsQueryVariables,
    type ArtistQueryVariables,
    type CreateArtist,
    type CreateArtistVariables,
    type DeleteArtists,
    type UpdateArtist,
    type UpdateArtistVariables,
    type DeleteArtistsVariables,
} from '../../shared/generated-types';
import {artistQuery, artistsQuery, createArtist, deleteArtists, updateArtist} from './artist.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

@Service()
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
    DeleteArtistsVariables
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
