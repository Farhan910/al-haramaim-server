const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmlum.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productsCollection = await client
      .db("alHaramain")
      .collection("product");

    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();

      res.send(products);
    });

    app.get("/myitem", async (req, res) => {
        const email = req.query.email;
        const query = {email: email};
        const cursor = productsCollection.find(query);
        const products = await cursor.toArray();
    
        res.send(products);
    }),

    
    app.delete("/product/:id",async (req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await productsCollection.deleteOne(query);
        res.send(result);
    });
    app.post("/login",(req, res) =>{

        const email =req.body.email;
        const token = jw.sign(email, token);
    })


    app.post("/product", (req, res) => {
      const product = req.body;
      productsCollection.insertOne(product);
      res.send(product);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      console.log(updatedProduct.quantity);
      const updateDoc = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
          shortDescription: updatedProduct.shortDescription,
          mainDescription: updatedProduct.mainDescription,
          mainDescription: updatedProduct.mainDescription,
          quantity: updatedProduct.quantity,
          
          image: updatedProduct.image,
          serviceProvider: updatedProduct.serviceProvider,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("haramain is running ");
});

app.listen(port, () => {
  console.log(`Server is running on port`, port);
});
