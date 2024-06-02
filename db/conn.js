const mongoose = require("mongoose");

const DB = process.env.MONGODB_URL
const MongoClient = require('mongodb').MongoClient;

mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    
}).then(()=> console.log("DataBase Connected")).catch((err)=>{
    console.log(err);
})


async function createIndex() {
    const uri =DB // Replace with your MongoDB connection string
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      const database = client.db('test'); // Replace with your database name
      const collection = database.collection('events'); // Replace with your collection name
  
      // Create 2dsphere index on the location field
      const result = await collection.createIndex({ location: '2dsphere' });
      console.log(`Index created: ${result}`);
  
    } finally {
      await client.close();
    }
  }
  
//   createIndex().catch(console.error);

  
  
  
  