const Task = require("../src/model/task.js")

require("../src/db/moongose.js")

// Task.findByIdAndDelete("64aa7e4791d87cb3fc1352d0")
//   .then((tsk) => {
//     console.log(tsk)
//     return Task.countDocuments({ completed: true })
//   })
//   .then((count) => {
//     console.log(count)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({ completed: false })
  return count
}

deleteTaskAndCount("64aac7b40f7fcaf82fb17583")
  .then((count) => console.log(count))
  .catch((err) => console.log(err))
