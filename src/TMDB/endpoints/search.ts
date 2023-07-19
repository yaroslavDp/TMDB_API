import { BaseEndpoint } from './base';
import { MovieResponse } from '../types/movie';
import { Search } from '../types/search';

const BASE_SEARCH = '/search';

interface SearchOptions {
  query: string;
  page?: number;
}

interface MovieSearchOptions extends SearchOptions {
  include_adult?: boolean;
  year?: number;
  primary_release_year?: number;
}

export class SearchEndpoint extends BaseEndpoint {
    constructor(protected readonly accessToken: string) {
      super(accessToken);
    }
  
    movies(options: MovieSearchOptions): Promise<Search<MovieResponse>> {
      return this.api.get<Search<MovieResponse>>(`${BASE_SEARCH}/movie`, options);
    }
  }