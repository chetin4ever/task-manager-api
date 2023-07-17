const express = require("express")
const User = require("./model/user")
const Task = require("./model/task")

const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

// const multer = require("multer")

const app = express()
const port = process.env.PORT
require("./db/moongose.js")
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log("server listening on port " + port)
})

const main = async () => {
  const task = await Task.findById("64b2acfe29fb87b0e752d712")
  console.log(task)

  await task.populate("owner")
  console.log(task.owner)
}

// const upload = multer({
//   dest: "images",
// })

// app.post("/upload", upload.single("upload"), (req, res) => {
//   res.send()
// })

// main()
