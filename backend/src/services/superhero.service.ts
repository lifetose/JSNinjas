import { ApiError } from "../errors/api-error";
import { ISuperheroListQuery } from "../interfaces/superhero.interface";
import { superheroPresenter } from "../presenters/superhero.presenter";
import { superheroRepository } from "../repositories/superhero.repository";

class SuperheroService {
  async getSuperheroes(query: ISuperheroListQuery) {
    const [entities, total, totalPages] =
      await superheroRepository.getSuperheroes(query);
    return superheroPresenter.toListResDto(entities, total, totalPages, query);
  }

  async getSuperheroById(id: number) {
    const hero = await superheroRepository.getSuperheroById(id);
    if (!hero) {
      throw new ApiError("Superhero not found", 404);
    }
    return hero;
  }

  async createSuperhero(data: any) {
    const hero = await superheroRepository.createSuperhero(data);
    return hero;
  }

  async updateSuperhero(id: number, data: any) {
    await superheroRepository.updateSuperhero(id, data);
  }

  async deleteSuperhero(id: number) {
    await superheroRepository.deleteSuperhero(id);
  }
}

export const superheroService = new SuperheroService();
