const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fqvfigl.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("comfy");
    const serviceCollection = database.collection('services');
    const orderCollection = database.collection('Orders');

    app.get('/services', async(req, res)=>{
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      // console.log(services);
      res.send(services);
    })

    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(req.params);
      const query = {_id: new ObjectId(id)};
      const service = await serviceCollection.findOne(query);
      res.send(service);
      // console.log(id);
    })

    app.get('/orders/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(req.params);
      const query = {_id: new ObjectId(id)};
      const service = await orderCollection.findOne(query);
      res.send(service);
      // console.log(id);
    })

    app.post('/orders', async(req, res)=>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
      console.log(order);
    })

    app.get('/orders', async(req, res)=>{
      let query = {};
      if (req.query.email){
        query = {
          email : req.query.email
        }
      }

      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);

    })

    app.delete('/orders/:id', async(req, res) =>{
      const id = req.params.id;
      console.log(id);
      const query = {_id : new ObjectId(id)};
      // console.log(query);
      const result = await orderCollection.deleteOne(query);
      // console.log(result);
      res.send(result);
    })

    app.put('/orders/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const user = req.body;
      const option = {upsert: true};
      const updatedProduct = {
        $set:{
          customer: user.customer,
          phone: user.phone
        }
      };
      const result = await orderCollection.updateOne(filter, updatedProduct, option);

      res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send("Hello world for comfy");
})

app.listen(port, ()=>{
    console.log(`Our comfy Running on port: ${port}`)
})