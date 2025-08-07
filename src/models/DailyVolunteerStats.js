import mongoose from "mongoose";

const dailyVolunteerStatsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    newVolunteers: {
        type: Number,
        default: 0,
    },
    activeVolunteers: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export default mongoose.model("DailyVolunteerStats", dailyVolunteerStatsSchema);
