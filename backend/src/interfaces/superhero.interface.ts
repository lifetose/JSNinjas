import { PickRequired } from "../types/pick-required.type";

export interface ISuperhero {
  id: number;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  image?: string;
}

export interface ISuperheroInput extends Omit<ISuperhero, "id"> {}

export interface ISuperheroListQuery {
  limit?: number;
  page?: number;
  totalPages?: number;
}

export type ISuperheroResponse = Pick<
  ISuperhero,
  | "nickname"
  | "real_name"
  | "origin_description"
  | "superpowers"
  | "catch_phrase"
  | "image"
> &
  PickRequired<ISuperhero, "id">;

export interface ISuperheroListResponse {
  data: ISuperheroResponse[];
  total: number;
}
