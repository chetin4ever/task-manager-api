const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient

const connectionURL = porcces.env.MONGODB_URL
const databaseName = "tsk-manager"

MongoClient.connect(
  connectionURL,
  { useNewUrlparser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect")
    }
    console.log("conneted correctly")
    const db = client.db(databaseName)
    // insert single
    // db.collection("users").insertOne(
    //   {
    //     name: "chetan",
    //     age: "29",
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("error")
    //     }
    //     console.log(result.ops)
    //     console.log(result.connection)

    //   }
    // )
    // insert many
    // db.collection("users").insertMany(
    //   [
    //     { name: "piyush sonawane", age: 30 },
    //     { name: "vrushalee", age: 34 },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log(error)
    //     }
    //     console.log(result.connection)
    //     console.log(result.ops)
    //   }
    // )
    // insert task
    // db.collection("tasks").insertMany(
    //   [
    //     { task: "do lunch ", completed: false },
    //     { task: "complete project", completed: false },
    //     { task: "learn nodejs", completed: true },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log(error)
    //     }

    //     console.log(result.ops)
    //   }
    // )
    // find single document

    // find and findOne
    // db.collection("users").find({ age: 34 }, (error, user) => {
    //   if (error) {
    //     console.log(error)
    //   }
    //   console.log(user)
    // })
    // find task and show results
    //   db.collection("tasks")
    //     .find({ completed: false })
    //     .toArray((error, task) => {
    //       if (error) {
    //         console.log(error)
    //       }
    //       console.log(task)
    //     })
    //   // count task and show results
    //   db.collection("tasks").find({ completed: false }).count()
    //
    // delete many

    // db.collection("users")
    //   .deleteMany({
    //     age: 30,
    //   })
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error))
    db.collection("tasks")
      .deleteOne({
        task: "goto shop",
      })
      .then((result) => console.log(result))
      .catch((error) => console.log(error))
  }
)
