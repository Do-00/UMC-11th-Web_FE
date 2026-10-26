import type { TmdbMovieListItem } from "../../api/movies/models";
import type { MovieCardItem } from "../../types/movie-card-item";
import { getTmdbPosterUrl } from "./tmdb-image";

export function toMovieCardItem(
  movie: TmdbMovieListItem,
  isBookmarked: boolean,
): MovieCardItem {
  return {
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date,
    posterUrl: getTmdbPosterUrl(movie.poster_path),
    isBookmarked,
  };
}