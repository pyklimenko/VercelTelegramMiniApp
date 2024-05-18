const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;

let client;
let db;

async function connectToDatabase() {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('Marhi');
    console.log('Connected to MongoDB');
}

connectToDatabase().catch(console.error);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/getUserName', async (req, res) => {
    const { firstName, lastName } = req.query;
    console.log('Received query:', firstName, lastName); // Лог запроса
    if (!firstName || !lastName) {
        console.log('Missing first name or last name');
        return res.status(400).send('First name and last name are required');
    }

    try {
        const collection = db.collection('Students');
        const user = await collection.findOne({ firstName, lastName });
        console.log('Database query result:', user); // Лог результата запроса
        
        if (user) {
            const datesAttended = user.datesAttended || [];
            const atCount = datesAttended.length;
            console.log('User found, attendance count:', atCount);
            res.json({ found: true, atCount });
        } else {
            console.log('User not found');
            res.status(404).json({ found: false });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
