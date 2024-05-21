// getUser.js
const { connectToDatabase } = require('./db');

module.exports = async (req, res) => {
    const { firstName, lastName } = req.query;

    if (!firstName || !lastName) {
        return res.status(400).send('First name and last name are required');
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('Students');
        const user = await collection.findOne({ firstName, lastName });

        console.log('Database query result:', user);

        if (user) {
            const datesAttended = user.datesAttended || [];
            const taskInfo = user.taskInfo || "Отсутствует информация о задании.";
            const scores = user.scores || [];

            console.log('Пользователь найден');
            res.json({
                found: true,
                atCount: datesAttended.length,
                datesAttended,
                taskInfo,
                scores
            });
        } else {
            console.log('User not found');
            res.status(404).json({ found: false });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Internal Server Error');
    }
};
