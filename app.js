const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8v0lano.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const tasksCollection = client.db("todo").collection("tasks");
    const completesCollection = client.db("todo").collection("completes");

    // get all todos
    app.get("/tasks", async (req, res) => {
      const query = { email: req.query.email };
      const todos = await tasksCollection.find(query).toArray();
      res.send(todos);
    });
    // creating a todo
    app.post("/tasks", async (req, res) => {
      const task = req.body;

      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });

    // update a todo
    app.patch("/tasks", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };

      const updatedDoc = {
        $set: {
          img: req.body.img,
          name: req.body.name,
        },
      };
      const result = await tasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete("/tasks", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(filter);
      res.send(result);
    });

    // get all task completes

    app.get("/task-complete", async (req, res) => {
      const email = req.query.email;
      const filter = { email: email };

      const result = await completesCollection.find(filter).toArray();
      res.send(result);
    });

    // creater a task complete
    app.post("/task-complete", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const complete = {
        complete: req.body.complete,
        date: req.body.date,
        email: req.body.email,
        img: req.body.img,
      };
      await tasksCollection.deleteOne(filter);
      const result = await completesCollection.insertOne(complete);
      res.send(result);
    });

    // update a task complete
    app.patch("/task-complete", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };

      const updatedDoc = {
        $set: {
          comment: req.body.comment,
        },
      };
      const result = await completesCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // delete a task complete
    app.delete("/task-complete", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const result = await completesCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
