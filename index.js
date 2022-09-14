const express = require("express")
const cors = require("cors")
const { MongoClient, ObjectId } = require("mongodb")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// uri and client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2w1ht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
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

    // get folders for parent directory
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
      console.log(id)
      let query, cursor, folder

      if (id == "-1") {
        folder = {
          _id: "-1",
          name: "My Drive",
          type: "folder",
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

    // update folder name
  } finally {
  }
}

run().catch(console.dir)

app.get("/", (req, res) => {
  console.log("Server started")
  res.send("Server running")
})

app.listen(port, () => {
  console.log("listening to port", port)
})
