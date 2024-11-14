const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/book_management', {
    
    });
    console.log('Connecting Successfully!');
  } catch (ex) {
    console.error('Failed Connect!');
  }
}

module.exports = { connect };