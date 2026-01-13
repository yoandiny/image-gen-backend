import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { ImageToTextController } from "../controllers/image.controller.js";

const router = Router();



router.post('/text-to-image', authenticate, ImageToTextController);

export default router;