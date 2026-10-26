import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

const STARS = [1, 2, 3, 4, 5];

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

function MovieDetail({ movie }: { movie: TmdbMovieDetail }) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [rating, setRating] = useState(0);

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreText = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main>
      <section className="relative h-[220px] overflow-hidden bg-[#e5e7eb] sm:h-[300px]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.8rem] text-[#9ca3af]">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/10" />
        <div className="absolute inset-0 mx-auto flex max-w-[1120px] flex-col justify-between px-6 py-6 text-white">
          <Link
            to="/"
            className="flex w-fit items-center gap-1 text-[0.75rem]"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="h-4 w-4 brightness-0 invert"
            />
            영화 목록
          </Link>
          <div>
            <h1 className="text-[1.6rem] font-extrabold leading-tight sm:text-[2.25rem]">
              {movie.title}
            </h1>
            <p className="mt-1 text-[0.75rem]">{movie.original_title}</p>
            <p className="mt-2 text-[0.75rem] font-bold">
              {movie.release_date} · {genreText} · {formatRuntime(movie.runtime)}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1120px] grid-cols-1 gap-8 px-6 py-6 md:grid-cols-[140px_1fr_260px]">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-[140px] rounded-lg object-cover shadow-lg"
          />
        ) : (
          <div className="flex aspect-[2/3] w-[140px] items-center justify-center rounded-lg bg-[#e5e7eb] text-[0.75rem] text-[#9ca3af]">
            이미지 없음
          </div>
        )}

        <div className="min-w-0">
          <h2 className="text-[1.05rem] font-bold">{movie.tagline}</h2>
          <p className="mt-3 text-[0.8rem] leading-6 text-[#6b7280]">
            {movie.overview}
          </p>
          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-4 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-[0.75rem] font-bold text-white",
              isBookmarked ? "bg-[#2447cc]" : "bg-[#3461ff]",
            )}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className="h-3.5 w-3.5 brightness-0 invert"
            />
            {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
          </button>
        </div>

        <aside className="md:border-l md:border-[#e5e7eb] md:pl-8">
          <h2 className="text-[1.05rem] font-bold">내 평점</h2>
          <p className="mt-1 text-[0.65rem] text-[#9ca3af]">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="mt-3 flex gap-1.5">
            {STARS.map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
                onClick={() => setRating(star)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#e5e7eb] bg-white"
              >
                <img
                  src="/icons/star.svg"
                  alt=""
                  className={cn("h-4 w-4", star > rating && "opacity-40")}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-24 w-full resize-none rounded-md border border-[#e5e7eb] bg-white p-3 text-[0.75rem] outline-none placeholder:text-[#9ca3af]"
          />
          <button
            type="button"
            className="mt-2 w-full cursor-pointer rounded-md bg-[#111] py-2.5 text-[0.75rem] font-bold text-white"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  if (!isValidMovieId) {
    return (
      <main className="mx-auto max-w-[1120px] px-6 py-8">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-[1120px] px-6 py-8 text-[#6b7280]">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="mx-auto max-w-[1120px] px-6 py-8 text-[#ef4444]">
        {errorMessage ?? "영화 정보를 불러오지 못했어요."}
      </main>
    );
  }

  return <MovieDetail key={movie.id} movie={movie} />;
}