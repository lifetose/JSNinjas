import db from "../db/db";
import {
  ISuperheroListQuery,
  ISuperhero,
  ISuperheroInput,
} from "../interfaces/superhero.interface";

class SuperheroRepository {
  public async getSuperheroes(
    query: ISuperheroListQuery,
  ): Promise<[ISuperhero[], number, number]> {
    const { page, limit } = query;
    const optPage = page || 1;
    const optLimit = limit || 5;

    const offset = (optPage - 1) * optLimit;
    const res = await db.query<ISuperhero>(
      `SELECT * FROM superheroes ORDER BY id LIMIT $1 OFFSET $2`,
      [optLimit, offset],
    );
    const countRes = await db.query<{ count: string }>(
      "SELECT COUNT(*) FROM superheroes",
    );
    const total = parseInt(countRes.rows[0].count, 10);
    const totalPages = Math.ceil(total / optLimit);
    return [res.rows, total, totalPages];
  }

  public async getSuperheroById(id: number): Promise<ISuperhero> {
    const res = await db.query<ISuperhero>(
      "SELECT * FROM superheroes WHERE id = $1",
      [id],
    );
    return res.rows[0];
  }

  public async createSuperhero(data: ISuperheroInput): Promise<ISuperhero> {
    const res = await db.query<ISuperhero>(
      `INSERT INTO superheroes (nickname, real_name, origin_description, superpowers, catch_phrase, image)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data.nickname,
        data.real_name,
        data.origin_description,
        data.superpowers,
        data.catch_phrase,
        data.image,
      ],
    );
    return res.rows[0];
  }

  public async updateSuperhero(
    id: number,
    data: ISuperheroInput,
  ): Promise<void> {
    await db.query(
      `UPDATE superheroes SET nickname = $1, real_name = $2, origin_description = $3, superpowers = $4, catch_phrase = $5, image = $6 WHERE id = $7`,
      [
        data.nickname,
        data.real_name,
        data.origin_description,
        data.superpowers,
        data.catch_phrase,
        data.image,
        id,
      ],
    );
  }

  public async deleteSuperhero(id: number): Promise<void> {
    await db.query("DELETE FROM superheroes WHERE id = $1", [id]);
  }
}
export const superheroRepository = new SuperheroRepository();
