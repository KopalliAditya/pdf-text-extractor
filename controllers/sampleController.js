 
// sampleController.js
const Sample = require('../models/Sample');

// Example controller methods
exports.getSamples = async (req, res) => {
  try {
    const samples = await Sample.find();
    res.json(samples);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createSample = async (req, res) => {
  try {
    const { name } = req.body;
    const newSample = new Sample({ name });
    await newSample.save();
    res.json(newSample);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
