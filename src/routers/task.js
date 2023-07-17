const auth = require("../middleware/auth")
const Task = require("../model/task")
const express = require("express")
const router = new express.Router()

// add task
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

// read tasks
// read tasks
// GET /task?completed=true 0r false
// GET /task?limit=2&skip=2  sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id })
    // console.log(req.user)
    console.log(req.query.limit)
    console.log(req.query.skip)
    const match = {}
    const sort = {}
    if (req.query.completed) {
      match.completed = req.query.completed === "true"
    }
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":")
      console.log(parts)
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    }
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit) || 10,
        skip: parseInt(req.query.skip) || 0,
        sort,
      },
    })
    console.log(req.user.tasks)
    res.send(req.user.tasks)
  } catch (error) {
    res.status(500).send()
  }
})

//read single task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id
  //   const task = await Task.findById(_id)

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })
    console.log(task)
    if (!task) {
      res.status(500).send()
    }
    res.status(201).send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})
// update task
router.patch("/task/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  console.log(updates)
  const allowedUpadates = ["description", "completed"]
  const isValidOpertion = updates.every((update) =>
    allowedUpadates.includes(update)
  )
  if (!isValidOpertion) {
    return res.status(400).send({ error: "Invalid Updates" })
  }
  try {
    // const task = await Task.findByIdAndUpdate(req.params.id)
    // console.log(req.params.id)
    // console.log(req.user._id)

    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    // console.log(task)

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // })
    // console.log(task)
    updates.forEach((update) => (task[update] = req.body[update]))
    if (!task) {
      return res.status(404).send()
    }
    await task.save()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

// delete task
router.delete("/task/:id", auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id)
    // const task = await Task.findByIdAndDelete(req.params.id)
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    })

    // console.log(task)
    if (!task) {
      res.status(404).send(error)
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
