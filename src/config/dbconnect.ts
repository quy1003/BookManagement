const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
    
    });
    console.log('Connecting Successfully!');
  } catch (ex) {
    console.error('Failed Connect!');
  }
}

module.exports = { connect };