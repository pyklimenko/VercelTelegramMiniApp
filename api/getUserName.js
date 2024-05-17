const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('studentssrades');
  }
}

module.exports = async (req, res) => {
  const { firstName, lastName } = req.query;

  if (!firstName || !lastName) {
    return res.status(400).send('First name and last name are required Test2');
  }

  try {
    await connectToDatabase();

    const collection = db.collection('Students');
    const user = await collection.findOne({ firstName, lastName });

    console.log({user});

    if (user) {
      res.json({ userName: user.userName });
    } else {
      // res.status(404).json({ message: 'User not found Test2' });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).send('Internal Server Error Test2');
  }
};
