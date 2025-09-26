import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    group_name : {
        type: String,
        required: true,
        minlength : 1,
        maxlength: 255,
        unique: true,
    },
    id_admin: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "User"
    },
    created_at:{
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Group = mongoose.model("Group", groupSchema, "groups-test");
export default Group;