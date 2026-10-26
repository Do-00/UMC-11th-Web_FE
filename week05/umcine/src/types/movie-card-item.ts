export interface MovieCardItem {
  id: number;
  title: string;
  releaseDate: string;
  posterUrl: string | null;
  isBookmarked: boolean;
}