import 'dotenv/config';
import mongoose from 'mongoose';
import Workout from '../src/models/Workout.mjs';

const MONGO_URI = process.env.MONGO_URI;

const samples = [
    {
        name: "Push Day A",
        type: "strength",
        tags: ["push", "upper", "chest"],
        exercises: [
            { name: "Bench Press", target: "chest", defaultSets: 5, defaultReps: 5 },
            { name: "Overhead Press", target: "shoulders", defaultSets: 4, defaultReps: 8 }
        ],
        notes: "Warm up 10 min; focus on form."
    },
    {
        name: "Pull Day A",
        type: "strength",
        tags: ["pull", "upper", "back"],
        exercises: [
            { name: "Barbell Row", target: "back", defaultSets: 5, defaultReps: 5 },
            { name: "Lat Pulldown", target: "lats", defaultSets: 4, defaultReps: 10 }
        ],
        notes: "Controlled eccentrics."
    },
    {
        name: "Leg Day A",
        type: "strength",
        tags: ["legs", "lower", "quads"],
        exercises: [
            { name: "Back Squat", target: "quads", defaultSets: 5, defaultReps: 5 },
            { name: "Romanian Deadlift", target: "hamstrings", defaultSets: 4, defaultReps: 8 }
        ],
        notes: "Depth and bracing."
    },
    {
        name: "Zone 2 Cardio 40m",
        type: "cardio",
        tags: ["cardio", "zone2", "endurance"],
        exercises: [],
        notes: "Keep HR in zone 2 the whole time."
    },
    {
        name: "Mobility Flow",
        type: "custom",
        tags: ["mobility", "recovery"],
        exercises: [],
        notes: "Hip openers + t-spine rotations."
    }
];

async function run() {
    if (!MONGO_URI) {
        console.error("Missing MONGO_URI in .env");
        process.exit(1);
    }

    try {
        console.log("Connecting to Mongo...");
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected.");

        console.log("Clearing existing workouts...");
        await Workout.deleteMany({});

        console.log("Inserting sample workouts...");
        const inserted = await Workout.insertMany(samples);
        console.log(`Inserted ${inserted.length} workouts.`);

        await mongoose.disconnect();
        console.log("Done.");
        process.exit(0);
    } catch (err) {
        console.error("Seed error:", err?.message || err);
        process.exit(1);
    }
}

run();
