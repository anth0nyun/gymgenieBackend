import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
    {
        exerciseName: { type: String, required: true, trim: true },
        sets: { type: Number, min: 0 },
        reps: { type: Number, min: 0 },
        weight: { type: Number, min: 0 },
        rpe: { type: Number, min: 1, max: 10 }
    },
    { _id: false }
);

const sessionSchema = new mongoose.Schema(
    {
        workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
        startedAt: { type: Date, default: () => new Date() },
        endedAt: { type: Date },
        notes: { type: String, trim: true },
        entries: { type: [entrySchema], default: [] }
    },
    { timestamps: true }
);

sessionSchema.index({ createdAt: -1 });

export default mongoose.model('Session', sessionSchema);
