const { default: mongoose } = require("mongoose")
const moongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./task")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid")
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (value.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password contains PASSWORD characters")
        }
      },
    },
    age: {
      default: 0,
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("age must be greater than zero")
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
)
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
})
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  return userObject
}
userSchema.methods.generateAuthToken = async function () {
  const user = this
  console.log(user)
  const token = jwt.sign({ _id: user._id.toString() }, "thisismystring")
  user.tokens = user.tokens.concat({ token })
  await user.save()
  console.log(token)
  return token
}
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("Uanble to Login")
  }
  const isMatch = await bcrypt.compare(password, user.password)
  console.log(isMatch)
  if (!isMatch) {
    console.log("unable to match password")
    throw new Error("Unable to login")
  }
  return user
}
// delte user and associted task
userSchema.methods.deleteData = async function () {
  const user = this
  await Task.deleteMany({ owner: user._id })
}

// #the palin text password
userSchema.pre("save", async function (next) {
  const user = this
  console.log("middleware run")
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})
const User = moongoose.model("User", userSchema)
module.exports = User
