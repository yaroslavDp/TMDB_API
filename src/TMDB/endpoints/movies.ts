import { BaseEndpoint } from './base';
import {
  PopularMovies,
  TopRatedMovies,
  UpcomingMovies
, MovieDetails } from '../types/movie';
import { PageOption, LanguageOption, RegionOption } from '../types/options';

const BASE_MOVIE = '/movie';

export class MoviesEndpoint extends BaseEndpoint {
  constructor(protected readonly accessToken: string) {
    super(accessToken);
  }

  details(id: string): Promise<MovieDetails> {
      const movieId = Number(id);
      return this.api.get<MovieDetails>(`${BASE_MOVIE}/${movieId}`);
  }

  popular(options?: PageOption): Promise<PopularMovies> {
    return this.api.get<PopularMovies>(`${BASE_MOVIE}/popular`, options);
  }

  topRated(
    options?: PageOption & LanguageOption & RegionOption
  ): Promise<TopRatedMovies> {
    return this.api.get<TopRatedMovies>(
      `${BASE_MOVIE}/top_rated`,
      options
    );
  }

  upcoming(
    options?: PageOption & LanguageOption & RegionOption
  ): Promise<UpcomingMovies> {
    return this.api.get<UpcomingMovies>(
      `${BASE_MOVIE}/upcoming`,
      options
    );
  }
}
