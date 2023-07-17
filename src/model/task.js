const moongoose = require("mongoose")
const taskSchema = moongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: moongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
)
taskSchema.pre("save", function (next) {
  console.log("middleware is running")
  next()
})
const Task = moongoose.model("Task", taskSchema)
module.exports = Task
