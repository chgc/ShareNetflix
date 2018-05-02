export interface Video {
  bgImages: string;
  episode: number;
  id: string;
  releaseYear: number;
  runtime: number;
  session: number;
  numSeasonsLabel: string;
  summary: string;
  title: string;
  likes: number;
  genres: number[];
  genresDisplay: GenresDisplay[];
}

export interface GenresDisplay {
  id: string;
  name: string;
}
