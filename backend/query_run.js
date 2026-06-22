const mongoose = require('mongoose');

const mongoUrl = "mongodb+srv://Aryan123:Aryan123@mernapp.nhd0znp.mongodb.net/Spectre-AI";

async function run() {
  await mongoose.connect(mongoUrl);
  
  const TestRunSchema = new mongoose.Schema({}, { strict: false });
  const TestRun = mongoose.model('TestRun', TestRunSchema, 'testruns');
  
  const doc = await TestRun.findById("6a37a8a0bf127234ff82d67c");
  console.log("SUCCESSFUL RUN DETAILS:", JSON.stringify(doc, null, 2));

  await mongoose.disconnect();
}

run().catch(console.error);
