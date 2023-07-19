import { MoviesEndpoint } from './endpoints/movies';
import { SearchEndpoint } from './endpoints/search';
  
export class TMDB {
    private readonly accessToken: string;
  
    constructor(accessToken: string) {
      this.accessToken = accessToken;
    }
  
    get search(): SearchEndpoint {
      return new SearchEndpoint(this.accessToken);
    }
  
    get movies(): MoviesEndpoint {
      return new MoviesEndpoint(this.accessToken);
    }
}
  