import { configs } from "../config/configs";
import {
  ISuperhero,
  ISuperheroListQuery,
  ISuperheroListResponse,
  ISuperheroResponse,
} from "../interfaces/superhero.interface";

class SuperheroPresenter {
  public toPublicResDto(entity: ISuperhero): ISuperheroResponse {
    return {
      id: entity.id,
      nickname: entity.nickname,
      real_name: entity.real_name,
      origin_description: entity.origin_description,
      superpowers: entity.superpowers,
      catch_phrase: entity.catch_phrase,
      image: entity.image ? `${configs.AWS_S3_ENDPOINT}/${entity.image}` : null,
    };
  }

  public toListResDto(
    entities: ISuperhero[],
    total: number,
    totalPages: number,
    query: ISuperheroListQuery,
  ): ISuperheroListResponse {
    return {
      data: entities.map(this.toPublicResDto),
      total,
      totalPages,
      ...query,
    };
  }
}

export const superheroPresenter = new SuperheroPresenter();
