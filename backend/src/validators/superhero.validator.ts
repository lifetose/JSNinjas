import joi from "joi";

export class SuperheroValidator {
  private static nickname = joi.string().min(3).max(20).trim();
  private static real_name = joi.string().min(3).max(120);
  private static origin_description = joi.string().min(3).max(500).trim();
  private static superpowers = joi.string().min(3).max(100).trim();
  private static catch_phrase = joi.string().min(3).max(100).trim();

  private static deleteImage = joi.boolean();

  public static create = joi.object({
    nickname: this.nickname.required(),
    real_name: this.real_name.required(),
    origin_description: this.origin_description.required(),
    superpowers: this.superpowers.required(),
    catch_phrase: this.catch_phrase.required(),
    deleteImage: this.deleteImage,
  });

  public static update = joi.object({
    nickname: this.nickname.required(),
    real_name: this.real_name.required(),
    origin_description: this.origin_description.required(),
    superpowers: this.superpowers.required(),
    catch_phrase: this.catch_phrase.required(),
    deleteImage: this.deleteImage,
  });

  public static listQuery = joi.object({
    limit: joi.number().min(1).max(100).default(10),
    page: joi.number().min(1).default(1),
  });
}
