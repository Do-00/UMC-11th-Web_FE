import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Pagination from "../../components/movies/pagination";
import MovieGrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { toMovieCardItem } from "../../utils/movies/to-movie-card-item";

type CardSize = "small" | "large";

const CARD_SIZE_KEY = "umcine-card-size";
const MAX_TMDB_PAGE = 500;

function readCardSize(): CardSize {
  return localStorage.getItem(CARD_SIZE_KEY) === "large" ? "large" : "small";
}

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [cardSize, setCardSize] = useState<CardSize>(readCardSize);

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, MAX_TMDB_PAGE));
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [page, retryCount]);

  const movieCardItems = movies.map((movie) =>
  toMovieCardItem(movie, bookmarkedMovieIds.includes(movie.id)),
  );

  function handleCardSize(size: CardSize) {
    setCardSize(size);
    localStorage.setItem(CARD_SIZE_KEY, size);
  }

  function handleChangePage(nextPage: number) {
    navigate({ search: { page: nextPage } });
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="mx-auto max-w-[1120px] px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[1.8rem] font-bold">영화 목록</h1>
        <div className="flex gap-2">
          {(["small", "large"] as const).map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={cardSize === size}
              onClick={() => handleCardSize(size)}
              className={cn(
                "cursor-pointer rounded-md border px-3 py-1 text-[0.75rem] font-bold",
                cardSize === size
                  ? "border-[#111] bg-[#111] text-white"
                  : "border-[#e5e7eb] bg-white text-[#111]",
              )}
            >
              {size === "small" ? "작게" : "크게"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="py-20 text-center text-[#6b7280]">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <p className="text-[#ef4444]">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="cursor-pointer rounded-md bg-[#111] px-4 py-2 text-[0.75rem] font-bold text-white"
          >
            다시 시도
          </button>
        </div>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-[#6b7280]">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <>
          <MovieGrid
            movies={movieCardItems}
             cardSize={cardSize}
               onToggleBookmark={toggleBookmark}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChangePage={handleChangePage}
          />
        </>
      )}
    </main>
  );
}