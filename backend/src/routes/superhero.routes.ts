import { Router } from "express";
import { superheroController } from "../controllers/superhero.controller";

import { commonMiddleware } from "../middlewares/common.middleware";
import { SuperheroValidator } from "../validators/superhero.validator";

const router = Router();

router.get(
  "/",
  commonMiddleware.isQueryValid(SuperheroValidator.listQuery),
  superheroController.listSuperheroes,
);
router.get("/:id", superheroController.getSuperhero);
router.post(
  "/",
  commonMiddleware.isBodyValid(SuperheroValidator.create),
  superheroController.createSuperhero,
);
router.put(
  "/:id",
  commonMiddleware.isBodyValid(SuperheroValidator.update),
  superheroController.updateSuperhero,
);
router.delete("/:id", superheroController.deleteSuperhero);

export const superheroRouter = router;
