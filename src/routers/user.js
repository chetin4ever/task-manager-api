const sharp = require("sharp")
const auth = require("../middleware/auth")
const User = require("../model/user")
const express = require("express")
const router = new express.Router()
const multer = require("multer")

// create user
router.post("/users", async (req, res) => {
  //   ## get all user data
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (err) {
    res.status(400).send(err)
  }
})
// login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)

    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send()
  }
})
// logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})
// logout all users
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})
// read profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user)
})
// update user
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  console.log(updates)
  const allowedUpadates = ["name", "email", "password", "age"]
  const isValidOpertion = updates.every((update) =>
    allowedUpadates.includes(update)
  )
  if (!isValidOpertion) {
    return res.status(400).send({ error: "Invalid Updates" })
  }
  try {
    // console.log(req.params.id)
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // })
    // const user = await User.findByIdAndUpdate(req.params.id)
    updates.forEach((update) => (req.user[update] = req.body[update]))
    await req.user.save()
    // if (!user) {
    //   return res.status(404).send()
    // }
    res.send(req.user)
  } catch (error) {
    return res.status(404).send(error)
  }
})

// delete user
router.delete("/users/me", auth, async (req, res) => {
  try {
    // await req.user.remove().exec()

    // console.log(req.user)
    const user = await User.findByIdAndDelete(req.user._id)
    await user.deleteData()
    if (!user) {
      return res.status(400).send()
    }
    res.send(user)
  } catch (error) {
    res.status(500).send(error)
  }
})

// upload profile picture
const upload = multer({
  //   dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please Upload an image"))
    }
    cb(undefined, true)
  },
})

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    console.log(req)
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 300, height: 400 })
      .png()
      .toBuffer()
    req.user.avatar = buffer
    // req.user.avatar = req.file.buffer

    await req.user.save()
    res.send()
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message })
  }
)
//

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
    }
    res.set("Content-Type", "image/jpg")
    res.send(user.avatar)
  } catch (err) {
    res.status(400).send()
  }
})
// delete the avatar

router.delete("/users/avatar/delete", auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

// // read user by id
// router.get("/users/:id", async (req, res) => {
//     const _id = req.params.id
//     console.log(_id)
//     try {
//       const user = await User.findById(_id)
//       // console.log(user)
//       if (!user) {
//         res.status(500).send()
//       }
//       res.status(201).send(user)
//     } catch (error) {
//       res.status(400).send(error)
//     }
//   })

module.exports = router
