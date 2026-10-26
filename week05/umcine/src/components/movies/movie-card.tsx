import { Link } from "@tanstack/react-router";
import type { MovieCardItem } from "../../types/movie-card-item";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: MovieCardItem;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#e5e7eb] text-[0.75rem] text-[#9ca3af]">
              이미지 없음
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border",
            movie.isBookmarked
              ? "border-[#3461ff] bg-[#3461ff]"
              : "border-white/80 bg-black/70",
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="h-4 w-4 brightness-0 invert"
          />
        </button>
      </div>
      <h2 className="mt-2 truncate text-[0.8rem] font-bold">{movie.title}</h2>
      <p className="mt-0.5 text-[0.7rem] text-[#9ca3af]">{movie.releaseDate}</p>
    </article>
  );
}