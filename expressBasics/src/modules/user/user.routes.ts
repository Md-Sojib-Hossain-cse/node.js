import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", userController.createUser);

router.get("/", auth("admin", "agent"), userController.getAllUser);

router.get("/:id", userController.getSpecificUser);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

export const userRoutes = router;
