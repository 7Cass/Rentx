import { Router } from "express";
import multer from "multer";
import uploadConfig from "@config/upload";

import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { ensureAdmin } from "@shared/infra/http/middlewares/ensureAdmin";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { CreateCarSpecificationController } from "@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController";
import { UploadCarImagesController } from "@modules/cars/useCases/uploadCarImage/UploadCarImagesController";

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarsImagesController = new UploadCarImagesController();

const uploadCarImage = multer(uploadConfig);

carsRoutes.post(
    "/",
    ensureAuthenticated, ensureAdmin,
    createCarController.handle
);

carsRoutes.get("/available", listAvailableCarsController.handle);

carsRoutes.post(
    "/specifications/:id",
    ensureAuthenticated, ensureAdmin,
    createCarSpecificationController.handle
);

carsRoutes.post(
    "/images/:id", 
    ensureAuthenticated, ensureAdmin,
    uploadCarImage.array("images"),
    uploadCarsImagesController.handle
);

export { carsRoutes };