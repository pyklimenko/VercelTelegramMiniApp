const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI || 'mongodb+srv://petrklimenko:SgxG1AwKCq9FLgnG@studentsgrades.fhxjnip.mongodb.net/?retryWrites=true&w=majority&appName=StudentsGrades';

let client;
let db;

async function connectToDatabase() {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('studentssrades');
    console.log('Connected to MongoDB');
}

connectToDatabase().catch(console.error);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/getUserName', async (req, res) => {
    const { firstName, lastName } = req.query;
    if (!firstName || !lastName) {
        return res.status(400).send('First name and last name are required Test');
    }

    try {
        const collection = db.collection('Students');
        const user = await collection.findOne({ firstName, lastName });
        
        if (user) {
            res.json({ userName: user.userName });
        } else {
            res.status(404).json({ message: 'User not found Test' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error Test');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
