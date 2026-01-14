import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { ImageToImageController, ImageToTextController } from "../controllers/image.controller.js";

const router = Router();



router.post('/text-to-image', authenticate, ImageToTextController);

router.post('/image-to-image', authenticate, ImageToImageController);

export default router;