'use strict';
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: { type: Number },
    reps: { type: String }, // e.g. "8-12"
    duration: { type: String }, // e.g. "30s" for timed
    rest: { type: String }, // e.g. "60s"
    notes: { type: String },
    videoUrl: { type: String },
});

const daySchema = new mongoose.Schema({
    dayName: { type: String, required: true }, // e.g. "Monday – Push"
    focus: { type: String }, // e.g. "Chest, Shoulders, Triceps"
    exercises: [exerciseSchema],
    isRestDay: { type: Boolean, default: false },
});

const workoutPlanSchema = new mongoose.Schema(
    {
        trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String },
        weeks: { type: Number, default: 4 },
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
        days: [daySchema],
        isActive: { type: Boolean, default: true },
        startDate: { type: Date },
        endDate: { type: Date },
    },
    { timestamps: true }
);

workoutPlanSchema.index({ memberId: 1, isActive: 1 });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
