// https://nameless-savannah-03121.herokuapp.com/
const express = require("express")
const cors = require("cors")
const { MongoClient, ObjectId } = require("mongodb")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2w1ht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// run
async function run() {
  try {
    await client.connect()

    const db = client.db("driveClone")
    const foldersCollection = db.collection("drive")

    // get all folders
    app.get("/folders", async (req, res) => {
      // select all
      const cursor = foldersCollection.find({})
      const folders = await cursor.toArray()
      res.json(folders)
    })

    // get children folders by parent id
    app.get("/folders/:id", async (req, res) => {
      const id = req.params.id
      const query = { parent: id }
      const cursor = foldersCollection.find(query)

      const folders = await cursor.toArray()
      res.json(folders)
    })

    // get details of folder by id
    app.get("/folderDetails/:id", async (req, res) => {
      const id = req.params.id
      let query, cursor, folder

      // if id is -1, return My Drive as root
      if (id == "-1") {
        folder = {
          _id: "-1",
          name: "My Drive",
          type: "folder",
          level: 0,
          ancestors: [],
        }
      } else {
        query = { _id: ObjectId(id) }
        cursor = foldersCollection.find(query)
        folder = await cursor.toArray()
      }
      res.json(folder)
    })

    // post new folder
    app.post("/folders", async (req, res) => {
      const folder = req.body
      const result = await foldersCollection.insertOne(folder)
      res.json(result)
    })

    // delete folder and children if exists
    app.delete("/folders/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const parent = await foldersCollection.deleteOne(query) // remove parent
      // if children exist, remove
      const result = await foldersCollection.deleteMany({ "ancestors.id": id })
      // return toal deleted count
      result.deletedCount = parent.deletedCount + result.deletedCount

      res.json(result)
    })

    // update folder name
    app.put("/folders/:id", async (req, res) => {
      const folder = req.body
      const id = folder._id

      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = { $set: { name: folder.name } }
      // update parent
      const parent = await foldersCollection.updateOne(filter, updateDoc, options)

      // if children exist, update them
      const childrenFilter = { "ancestors.id": id }
      const updateChildren = { $set: { "ancestors.$.name": folder.name } }
      const result = await foldersCollection.updateMany(childrenFilter, updateChildren)

      // return total modified count
      result.modifiedCount = parent.modifiedCount + result.modifiedCount
      res.json(result)
    })
  } finally {
  }
}

run().catch(console.dir)

app.get("/", (req, res) => {
  console.log("Server started")
  res.send("Google Drive clone : Server running")
})

app.listen(port, () => {
  console.log("listening to port", port)
})
