import mongoose from "mongoose";
import Workout from "../models/Workout.mjs";

// utils 
const toInt = (v, fb) => {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : fb;
};

const SORT_WHITELIST = new Set(["name", "-name", "createdAt", "-createdAt", "updatedAt", "-updatedAt"]);


function buildFilter({ type, tag, q }) {
    const filter = {};
    if (type) filter.type = type;
    if (tag) filter.tags = tag;
    if (q) {

        filter.$text = { $search: q };
    }
    return filter;
}

// GET /api/workouts 
export const listWorkouts = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", type, tag, q, sort = "name" } = req.query;

        const filter = buildFilter({ type, tag, q });

        let mongoSort = "name";
        if (typeof sort === "string" && SORT_WHITELIST.has(sort)) {
            mongoSort = sort;
        }

        const p = Math.max(1, toInt(page, 1));
        const l = Math.min(100, Math.max(1, toInt(limit, 10)));

        const query = Workout.find(filter);

        const [items, total] = await Promise.all([
            query.sort(mongoSort).skip((p - 1) * l).limit(l).lean().exec(),
            Workout.countDocuments(filter),
        ]);

        res.status(200).json({
            page: p,
            limit: l,
            total,
            pages: Math.ceil(total / l),
            sort: mongoSort,
            items,
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/workouts/:id 
export const getWorkout = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: "Invalid workout id" });

        const doc = await Workout.findById(id).lean();
        if (!doc) return res.status(404).json({ msg: "Workout not found" });

        res.status(200).json(doc);
    } catch (err) {
        next(err);
    }
};

// POST /api/workouts 
export const createWorkout = async (req, res, next) => {
    try {
        const { name, type = "strength", exercises = [], tags = [], notes = "" } = req.body;
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json({ msg: "name is required (min 2 chars)" });
        }
        if (type && !["strength", "cardio", "custom"].includes(type)) {
            return res.status(400).json({ msg: "type must be strength|cardio|custom" });
        }
        if (!Array.isArray(exercises) || !exercises.every(e => e && typeof e.name === "string")) {
            return res.status(400).json({ msg: "exercises must be an array of { name, ... }" });
        }
        if (!Array.isArray(tags)) {
            return res.status(400).json({ msg: "tags must be an array of strings" });
        }

        const doc = await Workout.create({ name: name.trim(), type, exercises, tags, notes });
        res.status(201).json(doc);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/workouts/:id 
export const updateWorkout = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: "Invalid workout id" });

        const updates = { ...req.body };

        if (updates.name && (typeof updates.name !== "string" || updates.name.trim().length < 2)) {
            return res.status(400).json({ msg: "name must be a string (min 2 chars)" });
        }
        if (updates.type && !["strength", "cardio", "custom"].includes(updates.type)) {
            return res.status(400).json({ msg: "type must be strength|cardio|custom" });
        }
        if (updates.exercises && (!Array.isArray(updates.exercises) || !updates.exercises.every(e => e && typeof e.name === "string"))) {
            return res.status(400).json({ msg: "exercises must be an array of { name, ... }" });
        }
        if (updates.tags && !Array.isArray(updates.tags)) {
            return res.status(400).json({ msg: "tags must be an array of strings" });
        }

        if (typeof updates.name === "string") updates.name = updates.name.trim();

        const doc = await Workout.findByIdAndUpdate(id, updates, { new: true, runValidators: true, lean: true });
        if (!doc) return res.status(404).json({ msg: "Workout not found" });

        res.status(200).json(doc);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/workouts/:id 
export const deleteWorkout = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: "Invalid workout id" });

        const doc = await Workout.findByIdAndDelete(id).lean();
        if (!doc) return res.status(404).json({ msg: "Workout not found" });

        res.status(200).json({ msg: "Workout deleted", id: doc._id });
    } catch (err) {
        next(err);
    }
};

// GET /api/workouts/meta — counts and simple stats 
export const getWorkoutMeta = async (_req, res, next) => {
    try {
        const [total, byTypeRaw, topTags] = await Promise.all([
            Workout.estimatedDocumentCount(),
            Workout.aggregate([
                { $group: { _id: "$type", count: { $sum: 1 } } },
                { $project: { _id: 0, type: "$_id", count: 1 } },
            ]),
            Workout.aggregate([
                { $unwind: "$tags" },
                { $group: { _id: "$tags", count: { $sum: 1 } } },
                { $sort: { count: -1, _id: 1 } },
                { $limit: 10 },
                { $project: { _id: 0, tag: "$_id", count: 1 } },
            ]),
        ]);

        const byType = { strength: 0, cardio: 0, custom: 0 };
        for (const row of byTypeRaw) byType[row.type] = row.count;

        res.status(200).json({ total, byType, topTags });
    } catch (err) {
        next(err);
    }
};
