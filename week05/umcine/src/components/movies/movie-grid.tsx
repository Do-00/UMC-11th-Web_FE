import type { MovieCardItem } from "../../types/movie-card-item";
import { cn } from "../../utils/cn";
import MovieCard from "./movie-card";
interface MovieGridProps {
  movies: MovieCardItem[];
  cardSize: "small" | "large";
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({
  movies,
  cardSize,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-6 sm:grid-cols-2",
        cardSize === "small"
          ? "lg:grid-cols-3 xl:grid-cols-5"
          : "lg:grid-cols-2 xl:grid-cols-3",
      )}
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}