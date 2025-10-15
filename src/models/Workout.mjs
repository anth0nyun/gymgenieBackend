import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        muscleGroup: { type: String, trim: true },          // e.g., chest, legs, back
        defaultSets: { type: Number, min: 0 },
        defaultReps: { type: Number, min: 0 },
        tags: [{ type: String, trim: true }],
        notes: { type: String, trim: true }
    },
    { _id: false }
);

const workoutSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        type: { type: String, enum: ['strength', 'cardio', 'other'], default: 'strength' },
        exercises: { type: [exerciseSchema], default: [] }
    },
    { timestamps: true }
);

workoutSchema.index({ name: 'text', 'exercises.name': 'text' });
workoutSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model('Workout', workoutSchema);
