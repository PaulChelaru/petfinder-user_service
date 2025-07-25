import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
        default: uuidv4,
        index: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9_-]+$/.test(v);
            },
            message: "Username can only contain letters, numbers, underscores, and hyphens",
        },
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "volunteer", "admin"],
        default: "user",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email address",
        },
    },
    city: {
        type: String,
        required: true,
    },
    notifyByEmail: {
        type: Boolean,
        default: true,
    },
    notifyBySms: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
        required: function() {
            return this.notifyBySms === true;
        },
        validate: {
            validator: function(v) {
                // Only validate if notifyBySms is true or phoneNumber is provided
                if (this.notifyBySms || v) {
                    // E.164 format validation (optional + followed by 1-15 digits)
                    return /^\+?[1-9]\d{1,14}$/.test(v);
                }
                return true;
            },
            message: "Please enter a valid phone number in E.164 format",
        },
    },
}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);
