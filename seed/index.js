// Imports
const { generateUsers } = require('./scripts/users');
const { generateReviews } = require('./scripts/reviews');
const { User } = require('../models/user');

// Seed mongodb
const seedDb = async () => {
    try {
        // Clean up database
        await User.deleteMany({});

        // Generate fake data
        const users = await generateUsers();
        // TODO: generate reviews

        // Seed db
        const newUsers = await User.create(users).then((res) => {
            console.log('Users added to db...')
            return res;
        });

        // TODO: add reviews

        // TODO Create relationships
    } catch (error) {
        // TODO log error
        console.log(error);
    }
};

// Exports
module.exports = {
    seedDb
};