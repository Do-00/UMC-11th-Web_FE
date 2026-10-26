import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import { TmdbAttribution } from "../components/tmdb-attribution";


export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TmdbAttribution />
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});