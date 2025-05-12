export interface ISuperhero {
  id: number;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  image?: string;
}

export type ISuperheroInput = Omit<ISuperhero, "id">;

export interface ISuperheroes {
  data: ISuperhero[];
  total: number;
  totalPages: number;
}
