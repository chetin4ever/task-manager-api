const User = require("../src/model/user")
require("../src/db/moongose.js")
// User.findByIdAndUpdate("64aa9e5b2168b77a626dabff", { age: 29 })
//   .then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 29 })
//   })
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age })
  const count = await User.countDocuments({ age })
  return { user, count }
}

updateAgeAndCount("64aa9e5b2168b77a626dabff", 23)
  .then((result) => {
    console.log(result)
  })
  .catch((err) => {
    console.log(err)
  })
