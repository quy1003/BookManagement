const mongoose = require('mongoose');
const uri = process.env.MONGODB_URL
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function connect() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } catch (ex) {
    console.error('Failed Connect!');
  }
}

module.exports = { connect };