export function TmdbAttribution() {
  return (
    <footer className="mx-auto mt-12 flex max-w-[1120px] items-center justify-end gap-3 border-t border-[#e5e7eb] px-6 py-6">
      <img src="/TMDB.svg" alt="TMDB" className="h-3 w-auto" />
      <p className="text-[0.65rem] text-[#9ca3af]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}