import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

interface MovieListSearch {
  page?: number;
}

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): MovieListSearch => {
    const page = Number(search.page);

    return Number.isInteger(page) && page > 0 && page <= 500 ? { page } : {};
  },
  component: MovieListPage,
});