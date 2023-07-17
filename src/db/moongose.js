const moongoose = require("mongoose")
moongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  autoIndex: true,
})

// const Task = moongoose.model("Tasks", {
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
// })

// const me = new User({
//   name: "    CPMjk",
//   email: "CPMjk@gamil.com",
//   password: "PASSWor@124",
//   age: 23,
// })
// me.save()
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// const task = new Task({
//   description: "   join lecture ",
//   completed: true,
// })

// task
//   .save()
//   .then((task) => {
//     console.log(task)
//   })
//   .catch((err) => {
//     console.log(err)
//   })
