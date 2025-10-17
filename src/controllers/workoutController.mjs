import mongoose from "mongoose";
import Workout from "../models/Workout.mjs";

const toInt = (v, fb) => {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : fb;
};

export const listWorkouts = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", type, tag, q, sort = "name" } = req.query;

        const filter = {};
        if (type) filter.type = type;
        if (tag) filter.tags = tag;

        let query = Workout.find(filter);
        if (q) query = query.find({ $text: { $search: q } });

        const p = Math.max(1, toInt(page, 1));
        const l = Math.min(100, Math.max(1, toInt(limit, 10)));

        const [items, total] = await Promise.all([
            query.sort(sort).skip((p - 1) * l).limit(l).lean().exec(),
            Workout.countDocuments(filter),
        ]);

        res.status(200).json({ page: p, limit: l, total, pages: Math.ceil(total / l), items });
    } catch (err) {
        next(err);
    }
};

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

export const createWorkout = async (req, res, next) => {
    try {
        const { name, type = "strength", exercises = [], tags = [], notes = "" } = req.body;
        if (!name || typeof name !== "string") return res.status(400).json({ msg: "name is required" });

        const doc = await Workout.create({ name, type, exercises, tags, notes });
        res.status(201).json(doc);
    } catch (err) {
        next(err);
    }
};

export const updateWorkout = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: "Invalid workout id" });

        const updates = req.body ?? {};
        const doc = await Workout.findByIdAndUpdate(id, updates, { new: true, runValidators: true, lean: true });
        if (!doc) return res.status(404).json({ msg: "Workout not found" });

        res.status(200).json(doc);
    } catch (err) {
        next(err);
    }
};

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
