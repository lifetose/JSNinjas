import { NextFunction, Request, Response } from "express";
import { superheroService } from "../services/superhero.service";
import {
  ISuperhero,
  ISuperheroListQuery,
} from "../interfaces/superhero.interface";
import { s3Service } from "../services/s3.service";
import { UploadedFile } from "express-fileupload";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { superheroRepository } from "../repositories/superhero.repository";

class SuperheroController {
  public async listSuperheroes(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = req.query as unknown as ISuperheroListQuery;
      const result = await superheroService.getSuperheroes(query);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getSuperhero(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const hero = await superheroService.getSuperheroById(id);
      res.json(hero);
    } catch (e) {
      next(e);
    }
  }

  public async createSuperhero(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body as ISuperhero;
      let image = null;

      if (req.files?.image) {
        image = await s3Service.uploadSingleFile(
          req.files.image as UploadedFile,
          FileItemTypeEnum.SUPERHERO,
          dto.nickname,
        );
      }

      const hero = await superheroService.createSuperhero({ ...dto, image });
      res.status(201).json(hero);
    } catch (e) {
      next(e);
    }
  }

  public async updateSuperhero(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = parseInt(req.params.id);
      const dto = req.body as ISuperhero;
      const item = await superheroRepository.getSuperheroById(id);

      let image = item.image || null;

      if (req.files?.image || req.body.deleteImage === true) {
        if (item.image) {
          await s3Service.deleteFile(item.image);
        }
        if (req.files?.image) {
          image = await s3Service.uploadSingleFile(
            req.files.image as UploadedFile,
            FileItemTypeEnum.SUPERHERO,
            dto.nickname,
          );
        }
        if (req.body.deleteImage === true) {
          image = null;
        }
      }

      await superheroService.updateSuperhero(id, { ...dto, image });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async deleteSuperhero(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = parseInt(req.params.id);

      const hero = await superheroRepository.getSuperheroById(id);

      if (hero.image) {
        await s3Service.deleteFile(hero.image);
      }

      await superheroService.deleteSuperhero(id);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}
export const superheroController = new SuperheroController();
