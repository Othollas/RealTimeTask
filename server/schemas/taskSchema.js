import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  description: {
    type: String,
    maxlength: 1000,
    default: null
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // lien vers ta collection categories
    required: true
  },
  completed: {
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
  },
  recovery_time: {
    type: Date,
    default: null
  },
  point: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;