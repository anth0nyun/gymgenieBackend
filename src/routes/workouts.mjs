import { Router } from "express";
import {
    listWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
} from "../controllers/workoutController.mjs";

const router = Router();

router.get("/", listWorkouts);
router.get("/:id", getWorkout);
router.post("/", createWorkout);
router.patch("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
