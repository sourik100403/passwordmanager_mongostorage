const dotenv = require('dotenv')
const express = require('express')
const { MongoClient } = require('mongodb');  // import { MongoClient } from 'mongodb'
const bodyparser=require('body-parser')
const cors=require('cors')
dotenv.config()
// Connection URL
const url = process.env.MONGO_URL;
const client = new MongoClient(url);
// Database Name
const dbName = 'passOPManager';
dotenv.config()
const app = express()
const port = process.env.PORT;
app.use(bodyparser.json())
app.use(cors())

client.connect();
console.log('Connected successfully to server');

//get all the password
app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  console.log('Found documents =>', findResult);
  res.json(findResult)
})

//save a password
app.post('/', async (req, res) => {
  const password=req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.insertOne(password);
  console.log('Found documents =>', findResult);
  res.send({success:true,result:findResult})//npm i body-parser
})

//delete a  password
app.delete('/', async (req, res) => {
  const password=req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.deleteOne(password);
  console.log('Found documents =>', findResult);
  res.send({success:true,result:findResult})//npm i body-parser
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})