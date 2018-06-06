export interface Video {
  bgImages: string;
  id: string;
  releaseYear: number;
  summary: string;
  title: string;
  duration: string;
  likes: number;
  genres: number[];
  genresDisplay: GenresDisplay[];
}

export interface GenresDisplay {
  id: string;
  name: string;
}
