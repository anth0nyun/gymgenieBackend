import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        muscleGroup: { type: String, trim: true }, // e.g., chest, legs, back
        defaultSets: { type: Number, min: 0 },
        defaultReps: { type: Number, min: 0 },
        tags: [{ type: String, trim: true }]
    },
    { _id: false }
);

const workoutSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        type: { type: String, enum: ["strength", "cardio", "custom"], default: "strength", index: true },
        notes: { type: String, trim: true },
        exercises: { type: [exerciseSchema], default: [] }
    },
    { timestamps: true }
);

// Helpful indexes for search/sort
workoutSchema.index({ createdAt: -1 });
workoutSchema.index({ name: 'text', 'exercises.name': 'text' });

export default mongoose.model('Workout', workoutSchema);
