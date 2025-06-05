const mongoose = require('mongoose');
const User = require('../models/User');

async function makeAdmin(email) {
  try {
    await mongoose.connect('mongodb://localhost:27017/notora');
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    console.log(`Successfully made ${email} an admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

const email = 'Shivanshgarg007@gmail.com';
makeAdmin(email); 