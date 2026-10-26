import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) {
  const pageCount = Math.min(5, totalPages);
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from({ length: pageCount }, (_, index) => startPage + index);

  return (
    <div className="mt-10 flex justify-center gap-2">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onChangePage(page)}
          className={cn(
            "h-9 w-9 cursor-pointer rounded-lg border text-[0.9rem]",
            page === currentPage
              ? "border-[#3461ff] bg-[#3461ff] font-bold text-white"
              : "border-[#ddd] bg-white text-[#333]",
          )}
        >
          {page}
        </button>
      ))}
    </div>
  );
}