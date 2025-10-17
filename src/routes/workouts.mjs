import { Router } from "express";
import {
    listWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
} from "../controllers/workout.controller.mjs";

const router = Router();

router.get("/", listWorkouts);
router.get("/:id", getWorkout);
router.post("/", createWorkout);
router.patch("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
