const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
    
    });
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Connecting Successfully!');
  } catch (ex) {
    console.error('Failed Connect!');
  }
  finally{
    await mongoose.disconnect();
  }
}

module.exports = { connect };