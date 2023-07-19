import { Movie } from "../types/movie_transform";
import { MovieDetails, MovieResponse } from "../types/movie";

export function transformMovie(movie: MovieResponse | MovieDetails): Movie {
    return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path
    }
}