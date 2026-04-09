'use strict';
const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    food: { type: String, required: true },
    quantity: { type: String }, // e.g. "200g" or "1 cup"
    calories: { type: Number },
    protein: { type: Number }, // grams
    carbs: { type: Number },
    fat: { type: Number },
});

const mealSchema = new mongoose.Schema({
    mealName: { type: String, required: true }, // Breakfast, Pre-Workout, etc.
    time: { type: String }, // e.g. "07:30"
    items: [foodItemSchema],
    totalCalories: { type: Number },
});

const dietPlanSchema = new mongoose.Schema(
    {
        trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String },
        dailyCalories: { type: Number },
        protein: { type: Number }, // daily target grams
        carbs: { type: Number },
        fat: { type: Number },
        meals: [mealSchema],
        isActive: { type: Boolean, default: true },
        startDate: { type: Date },
        endDate: { type: Date },
    },
    { timestamps: true }
);

dietPlanSchema.index({ memberId: 1, isActive: 1 });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
