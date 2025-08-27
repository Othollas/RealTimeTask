import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    email: {
        type: String,
        maxlength: 1000,
        default: null
    },
    hashPassword: {
        type: mongoose.Schema.Types.ObjectId,
        maxlength: 1000,
        required: true
    },
    is_admin: {
        type: Boolean,
        required: true,
        default: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const User = mongoose.model("User", userSchema);
export default User;